import { DateTime } from 'luxon'

export function dateShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toLocaleString(DateTime.DATE_SHORT)
}

export function dateTimeShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)
}

export function timeShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toLocaleString(DateTime.TIME_SIMPLE)
}
