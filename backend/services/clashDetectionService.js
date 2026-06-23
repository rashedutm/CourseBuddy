// ============================================
// Clash Detection Service
// Pure JS — no DB queries
// Takes sections grouped by course
// Returns all clash-free combinations
// ============================================

// Check if two time slots overlap
const hasTimeClash = (sectionA, sectionB) => {
    if (sectionA.day !== sectionB.day) return false
    const startA = sectionA.timeStart
    const endA = sectionA.timeEnd
    const startB = sectionB.timeStart
    const endB = sectionB.timeEnd
    return !(endB <= startA || startB >= endA)
}

// Main clash detection algorithm
// sectionsByCourse = { courseCode: [section, section, ...], ... }
// Returns array of clash-free patterns
// Each pattern = array of one section per course
const generateClashFreePatterns = (sectionsByCourse) => {
    const courseCodes = Object.keys(sectionsByCourse)

    const generateCombinations = (courseIndex, currentCombo) => {
        // Base case — all courses assigned a section
        if (courseIndex === courseCodes.length) {
            return [currentCombo]
        }

        const courseCode = courseCodes[courseIndex]
        const sections = sectionsByCourse[courseCode]
        const results = []

        for (const section of sections) {
            // Check this section against all already selected sections
            const hasClash = currentCombo.some(existing => hasTimeClash(existing, section))

            if (!hasClash) {
                const nextCombos = generateCombinations(
                    courseIndex + 1,
                    [...currentCombo, section]
                )
                results.push(...nextCombos)
            }
        }

        return results
    }

    return generateCombinations(0, [])
}

module.exports = { generateClashFreePatterns, hasTimeClash }
