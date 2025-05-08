import { apiAuthenticated } from '../route'

export async function apiGetConversation(id: string, withMessages = false, withParticipants = false) {
    try {
        const request = await (
            await apiAuthenticated()
        ).get<Conversation>(`/conversation/${id}`, {
            params: {
                withMessages,
                withParticipants,
            },
        })

        if (!request.data) {
            return null
        }

        return request.data
    } catch {
        return null
    }
}
