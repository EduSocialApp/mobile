import { apiAuthenticated } from '../route'

export async function apiLinkMember(organizationId: string, userId: string, role: 'OWNER' | 'MODERATOR' | 'USER' = 'USER') {
    return (await apiAuthenticated()).post<{ message: string }>(`/org/${organizationId}/link`, { userId, role })
}
