import { apiAuthenticated } from '../route'

export async function apiNewMessage(conversationId: string, text: string, messageClientId?: string) {
    const result = await (
        await apiAuthenticated()
    ).post<{ id: string }>(`/message/conversation/${conversationId}`, {
        text,
        messageClientId,
    })

    if (!result.data.id) throw new Error('No result')

    return result.data
}
