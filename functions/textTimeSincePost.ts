import { dateDiff } from './date/dateDiff'
import { dateShort } from './date/dateFormat'

export function textTimeSincePost(dateStr: string) {
    const { days, hours, minutes, seconds } = dateDiff(dateStr, new Date().toISOString())

    if (days > 3) return dateShort(dateStr)
    if (days > 0) return `${Math.round(days)}d`
    if (hours > 0) return `${Math.round(hours)}h`
    if (minutes > 0) return `${Math.round(minutes)}m`
    return `${Math.round(seconds)}s`
}
