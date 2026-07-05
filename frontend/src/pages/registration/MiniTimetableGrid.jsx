import React from 'react'
import { sectionKey, courseColor } from './workspace/scheduleUtils'

// Returns the abbreviated label for a timetable block.
// When siblingMap is provided and this section shares its slot with others,
// all sibling section numbers are shown (e.g. "UC S01/S02").
function subjectTag(s, siblingMap) {
  const abbr = s.courseName
    ? s.courseName.split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join('')
    : s.courseCode
  const siblings = siblingMap?.get(sectionKey(s))
  const secLabel = siblings ? siblings.map((n) => `S${n}`).join('/') : `S${s.sectionNumber}`
  return `${abbr} ${secLabel}`
}

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
const LUNCH_START_SLOT = 13 - START_HOUR // 1pm
const LUNCH_SLOT_WIDTH = 1 // 1pm-2pm

function toSlot(time) {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return (h - START_HOUR) + (m >= 30 ? 0.5 : 0)
}

export default function MiniTimetableGrid({ pattern = [], conflictKeys = null, onBlockClick = null, selectedKeys = null, siblingMap = null }) {
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
              <span
                className="mtg-lunch-band"
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
                const isSelected = selectedKeys?.has(sectionKey(s))
                return (
                  <span
                    key={i}
                    className={`mtg-block${isConflict ? ' conflict' : ''}${onBlockClick ? ' clickable' : ''}${isSelected ? ' selected' : ''}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: isConflict ? 'transparent' : courseColor(s.courseCode).pastel,
                    }}
                    title={`${s.courseName || s.courseCode} · ${s.day} ${s.timeStart?.slice(0, 5)}–${s.timeEnd?.slice(0, 5)}${onBlockClick ? ' · click to add/remove from mix' : ''}`}
                    onClick={onBlockClick ? () => onBlockClick(s) : undefined}
                  >
                    <span className="mtg-block-label">{subjectTag(s, siblingMap)}</span>
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
