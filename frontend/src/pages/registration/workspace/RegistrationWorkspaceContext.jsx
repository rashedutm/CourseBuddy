import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { sumCredits } from './scheduleUtils'

const STORAGE_KEY = 'cb-registration-workspace-v1'
export const MAX_SAVED_PATTERNS = 5 // Draft Vault capacity (UC014 business rule)

const initialState = {
    meta: {
        studentID: null,
        programmeID: null,
        semesterID: null,
        semesterNumber: null,
        intakeMonth: null,
        academicSession: null,
        intakeID: null,
    },
    generatedPatterns: [],
    savedPatterns: [],
    currentGoal: { sections: [], label: 'Current Goal' },
    activeView: 'explore',
}

function loadPersisted() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        return { ...initialState, ...parsed, meta: { ...initialState.meta, ...parsed.meta } }
    } catch {
        return null
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'HYDRATE':
            return { ...state, ...action.payload }
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
        case 'SAVE_PATTERN': {
            // Vault is capped at MAX_SAVED_PATTERNS — silently ignore over-cap saves;
            // the UI disables the control and explains before it gets here.
            if (state.savedPatterns.length >= MAX_SAVED_PATTERNS) return state
            const sections = action.payload.sections || state.currentGoal.sections
            const entry = {
                id: `sp-${Date.now()}`,
                name: action.payload.name || `Draft ${state.savedPatterns.length + 1}`,
                sections,
                credits: sumCredits(sections),
                createdAt: new Date().toISOString(),
            }
            return { ...state, savedPatterns: [...state.savedPatterns, entry] }
        }
        case 'REMOVE_SAVED_PATTERN':
            return { ...state, savedPatterns: state.savedPatterns.filter((p) => p.id !== action.payload.id) }
        case 'LOAD_SAVED_PATTERN': {
            const found = state.savedPatterns.find((p) => p.id === action.payload.id)
            if (!found) return state
            return { ...state, currentGoal: { sections: found.sections, label: found.name } }
        }
        default:
            return state
    }
}

const WorkspaceContext = createContext(null)

export function RegistrationWorkspaceProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState, () => loadPersisted() || initialState)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }, [state])

    const actions = useMemo(() => ({
        setMeta: (meta) => dispatch({ type: 'SET_META', payload: meta }),
        setGeneratedPatterns: (patterns) => dispatch({ type: 'SET_GENERATED_PATTERNS', payload: patterns }),
        setActiveView: (view) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view }),
        setCurrentGoal: (sections, label) => dispatch({ type: 'SET_CURRENT_GOAL', payload: { sections, label } }),
        updateGoalSection: (courseCode, section) => dispatch({ type: 'UPDATE_GOAL_SECTION', payload: { courseCode, section } }),
        removeGoalSection: (courseCode) => dispatch({ type: 'REMOVE_GOAL_SECTION', payload: { courseCode } }),
        savePattern: (name, sections) => dispatch({ type: 'SAVE_PATTERN', payload: { name, sections } }),
        removeSavedPattern: (id) => dispatch({ type: 'REMOVE_SAVED_PATTERN', payload: { id } }),
        loadSavedPattern: (id) => dispatch({ type: 'LOAD_SAVED_PATTERN', payload: { id } }),
    }), [])

    const value = useMemo(() => ({ state, ...actions }), [state, actions])

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useRegistrationWorkspace() {
    const ctx = useContext(WorkspaceContext)
    if (!ctx) throw new Error('useRegistrationWorkspace must be used within RegistrationWorkspaceProvider')
    return ctx
}
