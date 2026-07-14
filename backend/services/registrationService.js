const db = require('../config/db')

// ============================================
// Subsystem 4 — Registration Simulation
// Draft Vault persistence (draft_vault table)
//
// The workspace holds richer per-draft state than draft_vault has columns for
// (credits, priority star, comment, exact created timestamp). Rather than alter
// the shared schema, the sections and those extras are stored together as JSON in
// patternData (TEXT), while the columns that DO exist are used properly:
//   draftName  <- name        (so drafts are queryable/readable in SQL)
//   isActive   <- !archived   (archiving a draft leaves the vault, but is kept)
//   semesterID <- the semester the draft belongs to
// ============================================

const q = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results)))
    })

// Every ID column in this schema is varchar(20) and MySQL is not in strict mode,
// so an over-long ID is silently truncated and later collides on the primary key.
// Keep it short.
const shortID = (prefix) => {
    const stamp = Date.now().toString(36).toUpperCase()
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
    return `${prefix}-${stamp}${rand}`
}

// DB row -> the shape the frontend workspace already expects
const toEntry = (row) => {
    let extra = {}
    try {
        extra = JSON.parse(row.patternData) || {}
    } catch {
        extra = {}
    }
    return {
        id: row.draftID,
        name: row.draftName,
        sections: extra.sections || [],
        credits: extra.credits || 0,
        comment: extra.comment,
        priority: Boolean(extra.priority),
        archived: !row.isActive,
        createdAt: extra.createdAt || row.createdDate,
        semesterID: row.semesterID,
    }
}

const toPatternData = (entry) =>
    JSON.stringify({
        sections: entry.sections || [],
        credits: entry.credits || 0,
        priority: Boolean(entry.priority),
        comment: entry.comment,
        createdAt: entry.createdAt || new Date().toISOString(),
    })

// ============================================
// Get every draft for a student (vault + archive).
// The client splits them on `archived`.
// ============================================
exports.getDraftsByStudent = async (studentID) => {
    const rows = await q(
        `SELECT draftID, studentID, draftName, patternData, semesterID, createdDate, isActive
         FROM draft_vault
         WHERE studentID = ?
         ORDER BY createdDate ASC, draftID ASC`,
        [studentID]
    )
    return rows.map(toEntry)
}

// ============================================
// Create a draft. draftID is supplied by the client so its optimistic UI and the
// stored row agree on the same identity.
// ============================================
exports.createDraft = async (draft) => {
    const draftID = draft.id || shortID('SP')
    const createdDate = new Date().toISOString().split('T')[0]

    await q(
        `INSERT INTO draft_vault
         (draftID, studentID, draftName, patternData, semesterID, createdDate, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            draftID,
            draft.studentID,
            draft.name,
            toPatternData(draft),
            draft.semesterID,
            createdDate,
            draft.archived ? 0 : 1,
        ]
    )

    const [row] = await q('SELECT * FROM draft_vault WHERE draftID = ?', [draftID])
    return toEntry(row)
}

// ============================================
// Patch a draft: rename, star, comment, archive/restore.
// Reads the row first so the JSON blob is merged rather than overwritten.
// Scoped by studentID so one student cannot touch another's draft.
// ============================================
exports.updateDraft = async (draftID, studentID, patch) => {
    const [row] = await q('SELECT * FROM draft_vault WHERE draftID = ? AND studentID = ?', [draftID, studentID])
    if (!row) return null

    const current = toEntry(row)
    const merged = { ...current, ...patch }

    // Archiving also drops the star — it has left the vault.
    if (patch.archived === true) merged.priority = false

    await q(
        `UPDATE draft_vault
         SET draftName = ?, patternData = ?, isActive = ?
         WHERE draftID = ? AND studentID = ?`,
        [merged.name, toPatternData(merged), merged.archived ? 0 : 1, draftID, studentID]
    )

    const [updated] = await q('SELECT * FROM draft_vault WHERE draftID = ?', [draftID])
    return toEntry(updated)
}

// ============================================
// Permanently delete a draft.
// ============================================
exports.deleteDraft = async (draftID, studentID) => {
    const result = await q('DELETE FROM draft_vault WHERE draftID = ? AND studentID = ?', [draftID, studentID])
    return result.affectedRows > 0
}
