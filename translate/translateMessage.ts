import { ptbr } from './ptbr'

export function translateMessage(message: string): string {
    return ptbr[message] || ptbr.unknown || 'Erro ao traduzir mensagem de erro'
}
