import { apiAuthenticated } from '../route'

interface Params {
    content: string
    toUserId?: string
    toOrganizationId?: string
    fromOrganizationId?: string
}

export async function apiNewConversation({ content, toUserId, toOrganizationId, fromOrganizationId }: Params) {
    return (await apiAuthenticated()).post<{ conversationId: string }>(`/conversation`, {
        content,
        toUserId,
        toOrganizationId,
        fromOrganizationId,
    })
}
