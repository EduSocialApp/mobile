import { apiAuthenticated } from '../route'

export async function apiGetUserConversations() {
    try {
        const request = await (await apiAuthenticated()).get<Conversation[]>(`/conversation`)

        return request.data || []
    } catch {
        return []
    }
}
