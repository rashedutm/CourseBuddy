import React from 'react'
import { sectionKey } from './workspace/scheduleUtils'

/*
 * MiniTimetableGrid — renders one pattern (an array of section objects) as a
 * compact weekly routine grid (Mon–Fri rows × 8am–6pm columns), with each
 * course shown as a pastel block positioned by its start/end time.
 * Mirrors the MiniTimetableCard look from the CourseBuddy Figma design.
 *
 * Expected section shape:
 *   { courseCode, sectionNumber, day: 'Mon'..'Fri', timeStart: 'HH:MM:SS', timeEnd: 'HH:MM:SS' }
 */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const START_HOUR = 8
const SLOTS = 10 // 8:00 → 18:00

// Soft pastels from the Figma design system, cycled per course.
const PASTELS = ['#BFDBFE', '#BBF7D0', '#FBCFE8', '#FEF08A', '#DDD6FE', '#BAE6FD', '#C7D2FE', '#FECACA']

function toSlot(time) {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return (h - START_HOUR) + (m >= 30 ? 0.5 : 0)
}

// Short subject tag for a block, e.g. "Ubiquitous Computing" + section 01 -> "UC S01".
function subjectTag(s) {
  const abbr = s.courseName
    ? s.courseName.split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join('')
    : s.courseCode
  return `${abbr} S${s.sectionNumber}`
}

export default function MiniTimetableGrid({ pattern = [], conflictKeys = null }) {
  // Stable colour per courseCode so the same course is one colour across rows.
  const colorMap = {}
  let ci = 0
  pattern.forEach((s) => {
    if (s.courseCode && !colorMap[s.courseCode]) {
      colorMap[s.courseCode] = PASTELS[ci % PASTELS.length]
      ci++
    }
  })

  return (
    <div className="mtg">
      <div className="mtg-times">
        <span className="mtg-corner" />
        {Array.from({ length: SLOTS }, (_, i) => (
          <span key={i} className="mtg-time">{START_HOUR + i}</span>
        ))}
      </div>

      {DAYS.map((day) => {
        const items = pattern.filter((s) => s.day && s.day.slice(0, 3) === day)
        return (
          <div key={day} className="mtg-row">
            <span className="mtg-day">{day}</span>
            <div className="mtg-track">
              {items.map((s, i) => {
                const start = toSlot(s.timeStart)
                const end = toSlot(s.timeEnd) || start + 1
                const left = (start / SLOTS) * 100
                const width = (Math.max(end - start, 1) / SLOTS) * 100
                const isConflict = conflictKeys?.has(sectionKey(s))
                return (
                  <span
                    key={i}
                    className={`mtg-block${isConflict ? ' conflict' : ''}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: isConflict ? 'transparent' : colorMap[s.courseCode],
                    }}
                    title={`${s.courseName || s.courseCode} · ${s.day} ${s.timeStart?.slice(0, 5)}–${s.timeEnd?.slice(0, 5)}`}
                  >
                    <span className="mtg-block-label">{subjectTag(s)}</span>
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
