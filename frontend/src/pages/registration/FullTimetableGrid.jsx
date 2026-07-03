import React, { useMemo } from 'react'
import { sectionKey } from './workspace/scheduleUtils'

// Full-size weekly timetable (Mon-Fri x 8am-6pm), used wherever a single
// pattern needs to be shown as the primary, definitive schedule (Blueprint,
// Report) rather than a compact multi-pattern preview (see MiniTimetableGrid).

const COURSE_COLORS = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#e67e22', '#16a085', '#d63031', '#2c3e50']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

function timeToRow(timeStr) {
    if (!timeStr) return 0
    const h = parseInt(timeStr.slice(0, 2))
    return h - 8 + 2
}

function dayToCol(dayStr) {
    if (!dayStr) return 0
    const d = dayStr.trim().toLowerCase()
    if (d.startsWith('mon')) return 2
    if (d.startsWith('tue')) return 3
    if (d.startsWith('wed')) return 4
    if (d.startsWith('thu')) return 5
    if (d.startsWith('fri')) return 6
    return 0
}

export default function FullTimetableGrid({ pattern, conflictKeys = null }) {
    const courseColorMap = useMemo(() => {
        const map = {}
        let idx = 0
        pattern.forEach(s => {
            if (!map[s.courseCode]) map[s.courseCode] = COURSE_COLORS[idx++ % COURSE_COLORS.length]
        })
        return map
    }, [pattern])

    return (
        <div className="timetable-wrapper">
            <div style={{
                display: 'grid',
                gridTemplateColumns: '48px repeat(5, 1fr)',
                gridTemplateRows: `36px repeat(${HOURS.length}, 56px)`,
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)',
                minWidth: '360px',
                fontSize: '12px'
            }}>
                {/* Header */}
                <div style={{ background: '#8b0000', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                {DAY_SHORT.map(d => (
                    <div key={d} style={{
                        background: '#8b0000', color: '#fff', fontWeight: 700,
                        fontSize: '11px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {d}
                    </div>
                ))}

                {/* Time slots */}
                {HOURS.map(h => (
                    <React.Fragment key={h}>
                        <div style={{
                            background: '#fdf0f0', color: '#8b0000', fontWeight: 600,
                            fontSize: '10px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', border: '1px solid #f0f0f0'
                        }}>
                            {h}:00
                        </div>
                        {DAY_SHORT.map(d => (
                            <div key={d} style={{ border: '1px solid #f5f5f5' }}></div>
                        ))}
                    </React.Fragment>
                ))}

                {/* Course blocks */}
                {pattern.map((s, i) => {
                    const col = dayToCol(s.day)
                    const startRow = timeToRow(s.timeStart)
                    const endRow = timeToRow(s.timeEnd)
                    if (!col || !startRow || !endRow || startRow >= endRow) return null
                    const isConflict = conflictKeys?.has(sectionKey(s))
                    return (
                        <div
                            key={i}
                            style={{
                                gridColumn: col,
                                gridRow: `${startRow} / ${endRow}`,
                                background: isConflict ? 'transparent' : courseColorMap[s.courseCode],
                                border: isConflict ? '2px dashed #dc2626' : 'none',
                                borderRadius: '6px',
                                padding: '4px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: isConflict ? '#dc2626' : '#fff',
                                overflow: 'hidden',
                                margin: '3px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                lineHeight: '1.4'
                            }}
                        >
                            <div>{s.courseCode}</div>
                            <div style={{ opacity: 0.85, fontWeight: 400 }}>S{s.sectionNumber}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
