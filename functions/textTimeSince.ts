import { dateDiff } from './date/dateDiff'
import { dateTimeShort, timeShort } from './date/dateFormat'

export function textTimeSincePost(dateStr: string) {
    const { days, hours, minutes, seconds } = dateDiff(dateStr, new Date().toISOString())

    if (days > 0) return dateTimeShort(dateStr)
    if (hours > 0) return `${Math.round(hours)}h`
    if (minutes > 0) return `${Math.round(minutes)}m`
    return `${Math.round(seconds)}s`
}

export function textTimeSinceMessage(dateStr: string) {
    const { days } = dateDiff(dateStr, new Date().toISOString())

    if (days > 1) return dateTimeShort(dateStr)
    if (days > 0) return `ontem ${timeShort(dateStr)}`
    return timeShort(dateStr)
}
