// Draft Vault persistence — Subsystem 4.
// Drafts belong to the student and live in the DB, so they survive logout.
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'

const parseError = async (response, fallback) => {
    const data = await response.json().catch(() => ({}))
    return new Error(data.message || data.error || fallback)
}

export const fetchDrafts = async (studentID) => {
    const response = await fetch(`${API_BASE_URL}/registration/drafts?studentID=${encodeURIComponent(studentID)}`)
    if (!response.ok) throw await parseError(response, 'Failed to load your saved drafts')
    return response.json()
}

export const createDraft = async (draft) => {
    const response = await fetch(`${API_BASE_URL}/registration/drafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
    })
    if (!response.ok) throw await parseError(response, 'Failed to save this draft')
    return response.json()
}

// patch: any of { name, priority, comment, archived }
export const updateDraft = async (draftID, studentID, patch) => {
    const response = await fetch(`${API_BASE_URL}/registration/drafts/${encodeURIComponent(draftID)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentID, ...patch })
    })
    if (!response.ok) throw await parseError(response, 'Failed to update this draft')
    return response.json()
}

export const deleteDraft = async (draftID, studentID) => {
    const response = await fetch(
        `${API_BASE_URL}/registration/drafts/${encodeURIComponent(draftID)}?studentID=${encodeURIComponent(studentID)}`,
        { method: 'DELETE' }
    )
    if (!response.ok) throw await parseError(response, 'Failed to delete this draft')
    return response.json()
}
