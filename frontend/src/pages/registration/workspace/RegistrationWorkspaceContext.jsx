import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { sumCredits, sectionKey } from './scheduleUtils'
import * as draftApi from '../../../services/registrationService'

// Saved drafts live in the DB (draft_vault), keyed by student — they must survive
// logout. Everything else here is transient working state (the patterns you just
// generated, what's on the Compare page, the in-progress mix) and stays in
// localStorage, scoped per student so signing in as someone else never shows you
// the previous student's workspace.
const STORAGE_PREFIX = 'cb-registration-workspace-v1'
const storageKey = (studentID) => `${STORAGE_PREFIX}:${studentID || 'anon'}`

export const MAX_SAVED_PATTERNS = 30
export const MAX_COMPARE_PATTERNS = 6 // how many patterns the Compare page can hold at once

const currentStudentID = () => localStorage.getItem('studentID')

const initialState = {
    meta: {
        studentID: null,
        programmeID: null,
        semesterID: null,
        semesterNumber: null,
        intakeMonth: null,
        academicSession: null,
        intakeID: null,
        // Per-student override for the handbook's designed semester credit
        // pace (see DEFAULT_TARGET_CREDITS_PER_SEMESTER in scheduleUtils.js
        // for the fallback). No settings UI sets this yet — it's here so one
        // can be added later without a data-model change.
        targetCreditsPerSemester: null,
    },
    generatedPatterns: [],
    savedPatterns: [], // hydrated from the DB, never from localStorage
    compareSet: [], // patterns currently on the Compare page, persists across navigation
    mixSections: [], // in-progress "Your Mix" selection on the Compare page, persists across navigation
    currentGoal: { sections: [], label: 'Current Goal' },
    activeView: 'explore',
}

function loadPersisted() {
    try {
        const raw = localStorage.getItem(storageKey(currentStudentID()))
        if (!raw) return null
        const parsed = JSON.parse(raw)
        return {
            ...initialState,
            ...parsed,
            meta: { ...initialState.meta, ...parsed.meta },
            // Drafts come from the server; ignore anything stale on disk.
            savedPatterns: [],
        }
    } catch {
        return null
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'HYDRATE':
            return { ...state, ...action.payload }
        case 'SET_SAVED_PATTERNS':
            return { ...state, savedPatterns: action.payload }
        case 'SET_META':
            return { ...state, meta: { ...state.meta, ...action.payload } }
        case 'SET_GENERATED_PATTERNS':
            return { ...state, generatedPatterns: action.payload }
        case 'SET_ACTIVE_VIEW':
            return { ...state, activeView: action.payload }
        case 'SET_CURRENT_GOAL':
            return { ...state, currentGoal: { sections: action.payload.sections || [], label: action.payload.label || state.currentGoal.label } }
        case 'UPDATE_GOAL_SECTION': {
            const { courseCode, section } = action.payload
            const withoutCourse = state.currentGoal.sections.filter((s) => s.courseCode !== courseCode)
            return { ...state, currentGoal: { ...state.currentGoal, sections: [...withoutCourse, section] } }
        }
        case 'REMOVE_GOAL_SECTION': {
            const { courseCode } = action.payload
            return {
                ...state,
                currentGoal: {
                    ...state.currentGoal,
                    sections: state.currentGoal.sections.filter((s) => s.courseCode !== courseCode),
                },
            }
        }
        case 'ADD_SAVED_PATTERN':
            return { ...state, savedPatterns: [...state.savedPatterns, action.payload] }
        case 'REPLACE_SAVED_PATTERN':
            return {
                ...state,
                savedPatterns: state.savedPatterns.map((p) => (p.id === action.payload.id ? action.payload.entry : p)),
            }
        case 'REMOVE_SAVED_PATTERN':
            return { ...state, savedPatterns: state.savedPatterns.filter((p) => p.id !== action.payload.id) }
        case 'RENAME_SAVED_PATTERN': {
            const { id, name } = action.payload
            if (!name || !name.trim()) return state
            return { ...state, savedPatterns: state.savedPatterns.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)) }
        }
        case 'LOAD_SAVED_PATTERN': {
            const found = state.savedPatterns.find((p) => p.id === action.payload.id)
            if (!found) return state
            return { ...state, currentGoal: { sections: found.sections, label: found.name } }
        }
        case 'TOGGLE_PRIORITY': {
            // Star / unstar — a simple boolean, no ranking or reordering.
            const { id } = action.payload
            return { ...state, savedPatterns: state.savedPatterns.map((p) => (p.id === id ? { ...p, priority: !p.priority } : p)) }
        }
        case 'ARCHIVE_PATTERN': {
            // Archiving also clears the star (it leaves the vault entirely).
            const { id } = action.payload
            return { ...state, savedPatterns: state.savedPatterns.map((p) => (p.id === id ? { ...p, archived: true, priority: false } : p)) }
        }
        case 'RESTORE_PATTERN': {
            const { id } = action.payload
            return { ...state, savedPatterns: state.savedPatterns.map((p) => (p.id === id ? { ...p, archived: false } : p)) }
        }
        case 'COMMENT_PATTERN': {
            const { id, comment } = action.payload
            return { ...state, savedPatterns: state.savedPatterns.map((p) => (p.id === id ? { ...p, comment } : p)) }
        }
        case 'ADD_TO_COMPARE_SET': {
            const additions = action.payload.entries.map((e, i) => ({
                id: `cmp-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
                pattern: e.pattern,
                label: e.label,
            }))
            const merged = [...state.compareSet, ...additions]
            const overflow = merged.length - MAX_COMPARE_PATTERNS
            return { ...state, compareSet: overflow > 0 ? merged.slice(overflow) : merged }
        }
        case 'REMOVE_FROM_COMPARE_SET':
            return { ...state, compareSet: state.compareSet.filter((c) => c.id !== action.payload.id) }
        case 'CLEAR_COMPARE_SET':
            return { ...state, compareSet: [], mixSections: [] }
        case 'SET_MIX_SECTIONS':
            return { ...state, mixSections: action.payload.sections }
        case 'TOGGLE_MIX_SECTION': {
            const { section } = action.payload
            const key = sectionKey(section)
            const exactMatch = state.mixSections.some((s) => sectionKey(s) === key)
            if (exactMatch) {
                // clicking the same block again → deselect it
                return { ...state, mixSections: state.mixSections.filter((s) => sectionKey(s) !== key) }
            }
            const sameCourse = state.mixSections.some((s) => s.courseCode === section.courseCode)
            if (sameCourse) {
                // different section of same course → swap, never duplicate
                return { ...state, mixSections: state.mixSections.map((s) => s.courseCode === section.courseCode ? section : s) }
            }
            return { ...state, mixSections: [...state.mixSections, section] }
        }
        default:
            return state
    }
}

const WorkspaceContext = createContext(null)

export function RegistrationWorkspaceProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState, () => loadPersisted() || initialState)

    // Latest state without making every action depend on it — the write-through
    // handlers below need to read the current draft to revert a failed change.
    const stateRef = useRef(state)
    stateRef.current = state

    // Load this student's drafts from the DB on sign-in. This is what makes the
    // vault survive logout: localStorage no longer holds them at all.
    useEffect(() => {
        const studentID = currentStudentID()
        if (!studentID) return
        let cancelled = false
        draftApi.fetchDrafts(studentID)
            .then((drafts) => {
                if (!cancelled) dispatch({ type: 'SET_SAVED_PATTERNS', payload: drafts })
            })
            .catch((err) => console.error('Unable to load saved drafts:', err.message))
        return () => { cancelled = true }
    }, [])

    // Persist only the transient workspace; drafts are the DB's job.
    useEffect(() => {
        const { savedPatterns, ...transient } = state
        localStorage.setItem(storageKey(currentStudentID()), JSON.stringify(transient))
    }, [state])

    const actions = useMemo(() => {
        // Pull the server's copy back in when a write fails, so the UI can never
        // drift away from what's actually stored.
        const resync = () => {
            const studentID = currentStudentID()
            if (!studentID) return
            draftApi.fetchDrafts(studentID)
                .then((drafts) => dispatch({ type: 'SET_SAVED_PATTERNS', payload: drafts }))
                .catch(() => {})
        }

        // Every mutation updates the UI immediately, then writes through to the DB.
        // If the write fails we resync rather than leave a phantom draft on screen.
        const writeThrough = (draftID, patch) => {
            const studentID = currentStudentID()
            if (!studentID) return
            draftApi.updateDraft(draftID, studentID, patch).catch((err) => {
                console.error('Unable to update draft:', err.message)
                resync()
            })
        }

        return {
            setMeta: (meta) => dispatch({ type: 'SET_META', payload: meta }),
            setGeneratedPatterns: (patterns) => dispatch({ type: 'SET_GENERATED_PATTERNS', payload: patterns }),
            setActiveView: (view) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view }),
            setCurrentGoal: (sections, label) => dispatch({ type: 'SET_CURRENT_GOAL', payload: { sections, label } }),
            updateGoalSection: (courseCode, section) => dispatch({ type: 'UPDATE_GOAL_SECTION', payload: { courseCode, section } }),
            removeGoalSection: (courseCode) => dispatch({ type: 'REMOVE_GOAL_SECTION', payload: { courseCode } }),

            savePattern: (name, sections) => {
                const { savedPatterns, meta } = stateRef.current
                if (savedPatterns.length >= MAX_SAVED_PATTERNS) return

                const chosen = sections || stateRef.current.currentGoal.sections
                if (!chosen || chosen.length === 0) return

                const studentID = currentStudentID() || meta.studentID
                const semesterID = meta.semesterID

                const entry = {
                    id: `sp-${Date.now()}`,
                    name: name || `Draft ${savedPatterns.length + 1}`,
                    sections: chosen,
                    credits: sumCredits(chosen),
                    createdAt: new Date().toISOString(),
                    priority: false,
                    archived: false,
                }

                // Show it straight away, then persist.
                dispatch({ type: 'ADD_SAVED_PATTERN', payload: entry })

                if (!studentID || !semesterID) {
                    console.error('Draft not persisted: missing studentID or semesterID in the workspace meta.')
                    return
                }

                draftApi.createDraft({ ...entry, studentID, semesterID })
                    .then((saved) => dispatch({ type: 'REPLACE_SAVED_PATTERN', payload: { id: entry.id, entry: saved } }))
                    .catch((err) => {
                        console.error('Unable to save draft:', err.message)
                        dispatch({ type: 'REMOVE_SAVED_PATTERN', payload: { id: entry.id } })
                    })
            },

            removeSavedPattern: (id) => {
                dispatch({ type: 'REMOVE_SAVED_PATTERN', payload: { id } })
                const studentID = currentStudentID()
                if (!studentID) return
                draftApi.deleteDraft(id, studentID).catch((err) => {
                    console.error('Unable to delete draft:', err.message)
                    resync()
                })
            },

            renamePattern: (id, name) => {
                if (!name || !name.trim()) return
                dispatch({ type: 'RENAME_SAVED_PATTERN', payload: { id, name } })
                writeThrough(id, { name: name.trim() })
            },

            loadSavedPattern: (id) => dispatch({ type: 'LOAD_SAVED_PATTERN', payload: { id } }),

            togglePriority: (id) => {
                const current = stateRef.current.savedPatterns.find((p) => p.id === id)
                dispatch({ type: 'TOGGLE_PRIORITY', payload: { id } })
                writeThrough(id, { priority: !current?.priority })
            },

            archivePattern: (id) => {
                dispatch({ type: 'ARCHIVE_PATTERN', payload: { id } })
                writeThrough(id, { archived: true })
            },

            restorePattern: (id) => {
                dispatch({ type: 'RESTORE_PATTERN', payload: { id } })
                writeThrough(id, { archived: false })
            },

            commentPattern: (id, comment) => {
                dispatch({ type: 'COMMENT_PATTERN', payload: { id, comment } })
                writeThrough(id, { comment })
            },

            addToCompareSet: (entries) => dispatch({ type: 'ADD_TO_COMPARE_SET', payload: { entries } }),
            removeFromCompareSet: (id) => dispatch({ type: 'REMOVE_FROM_COMPARE_SET', payload: { id } }),
            clearCompareSet: () => dispatch({ type: 'CLEAR_COMPARE_SET' }),
            setMixSections: (sections) => dispatch({ type: 'SET_MIX_SECTIONS', payload: { sections } }),
            toggleMixSection: (section) => dispatch({ type: 'TOGGLE_MIX_SECTION', payload: { section } }),
        }
    }, [])

    const value = useMemo(() => ({ state, ...actions }), [state, actions])

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useRegistrationWorkspace() {
    const ctx = useContext(WorkspaceContext)
    if (!ctx) throw new Error('useRegistrationWorkspace must be used within RegistrationWorkspaceProvider')
    return ctx
}
