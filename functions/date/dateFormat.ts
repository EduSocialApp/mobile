import { DateTime } from 'luxon'

export function dateShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toLocaleString(DateTime.DATE_SHORT)
}
