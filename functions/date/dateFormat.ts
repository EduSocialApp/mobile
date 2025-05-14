import { DateTime } from 'luxon'

export function dateShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toFormat('dd/MM/yy')
}

export function dateTimeShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toFormat('dd/MM/yy HH:mm')
}

export function timeShort(date: string) {
    return DateTime.fromISO(date).setLocale('pt-BR').toFormat('HH:mm')
}
