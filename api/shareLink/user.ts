import { apiAuthenticated } from '../route'

export interface UserLinkShareable {
    id: string
    maxUses: number
    expiresAt?: string
}

export async function apiUserLinkShareable(userId = '') {
    return (await apiAuthenticated()).post<UserLinkShareable>(`/link/user`, {
        userId,
    })
}
