import React from 'react'
import { sectionKey, courseColor } from './workspace/scheduleUtils'

function secLabel(s, siblingMap) {
    const siblings = siblingMap?.get(sectionKey(s))
    return siblings ? siblings.map((n) => `S${n}`).join('/') : `S${s.sectionNumber}`
}

function subjectAbbr(s) {
    return s.courseName
        ? s.courseName.split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join('')
        : s.courseCode
}

// Full-size weekly timetable, used wherever a single pattern needs to be
// shown as the primary, definitive schedule (Registration Cockpit). Same
// days-as-rows / times-as-columns orientation as MiniTimetableGrid, just
// bigger and more legible — the whole app should read the same way.

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const START_HOUR = 8
const SLOTS = 10 // 8:00 → 18:00
const LUNCH_START_SLOT = 13 - START_HOUR
const LUNCH_SLOT_WIDTH = 1

function toSlot(time) {
    if (!time) return 0
    const [h, m] = time.split(':').map(Number)
    return (h - START_HOUR) + (m >= 30 ? 0.5 : 0)
}

export default function FullTimetableGrid({ pattern = [], conflictKeys = null, siblingMap = null }) {
    return (
        <div className="ftg">
            <div className="ftg-times">
                <span className="ftg-corner" />
                {Array.from({ length: SLOTS }, (_, i) => (
                    <span key={i} className="ftg-time">{START_HOUR + i}:00</span>
                ))}
            </div>

            {DAYS.map((day) => {
                const items = pattern.filter((s) => s.day && s.day.slice(0, 3) === day)
                return (
                    <div key={day} className="ftg-row">
                        <span className="ftg-day">{day}</span>
                        <div className="ftg-track">
                            <span
                                className="ftg-lunch-band"
                                style={{
                                    left: `${(LUNCH_START_SLOT / SLOTS) * 100}%`,
                                    width: `${(LUNCH_SLOT_WIDTH / SLOTS) * 100}%`,
                                }}
                                title="Lunch break 1:00–2:00 PM"
                            />
                            {items.map((s, i) => {
                                const start = toSlot(s.timeStart)
                                const end = toSlot(s.timeEnd) || start + 1
                                const left = (start / SLOTS) * 100
                                const width = (Math.max(end - start, 1) / SLOTS) * 100
                                const isConflict = conflictKeys?.has(sectionKey(s))
                                return (
                                    <span
                                        key={i}
                                        className={`ftg-block${isConflict ? ' conflict' : ''}`}
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`,
                                            background: isConflict ? 'transparent' : courseColor(s.courseCode).pastel,
                                        }}
                                        title={`${s.courseName || s.courseCode} · ${secLabel(s, siblingMap)} · ${s.day} ${s.timeStart?.slice(0, 5)}–${s.timeEnd?.slice(0, 5)} · ${s.lecturerName || 'TBA'}`}
                                    >
                                        <span className="ftg-block-abbr">{subjectAbbr(s)}</span>
                                        <span className="ftg-block-code">{s.courseCode}</span>
                                        <span className="ftg-block-sec">{secLabel(s, siblingMap)}</span>
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
