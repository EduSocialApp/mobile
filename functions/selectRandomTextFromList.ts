export function selectRandomTextFromList(texts: string[]): string {
    if (!texts || texts.length === 0) return 'Texto não encontrado'
    const randomIndex = Math.floor(Math.random() * texts.length)
    return texts[randomIndex]
}
