import { DateTime } from 'luxon'

export function dateDiff(start: string, end: string) {
    const startDate = DateTime.fromISO(start)
    const endDate = DateTime.fromISO(end)

    const diff = endDate.diff(startDate, ['minutes', 'days', 'hours', 'seconds'])

    let { days, minutes, seconds, hours } = diff.toObject()

    if (!days) days = 0
    if (!minutes) minutes = 0
    if (!seconds) seconds = 0
    if (!hours) hours = 0

    return { days, minutes, seconds, hours }
}
