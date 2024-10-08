import { apiAuthenticated } from '../route'

export interface UsersToInviteResult {
    itens: UserToInvite[]
    lastUserId?: string
}

export interface UserToInvite {
    id: string
    name: string
    displayName: string
    pictureUrl: string
    biography: string
    organizations: {
        id: string
        role: string
        invited: boolean
    }[]
}

interface Params {
    query: string
    userId?: string
    organizationId?: string
}

export async function apiUsersToInvite({ query, userId, organizationId }: Params): Promise<UsersToInviteResult> {
    try {
        const result = await (
            await apiAuthenticated()
        ).get<UserToInvite[]>(`/user/toInvite`, {
            params: {
                query,
                lastUserId: userId,
                organizationId: organizationId,
            },
        })

        if (!result) throw new Error('No result')

        return {
            itens: result.data || [],
            lastUserId: result.headers['last-user-id'],
        }
    } catch {
        return {
            itens: [],
        }
    }
}
