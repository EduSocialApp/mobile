import { apiAuthenticated } from '../route'

export interface FindResult {
    itens: FindItem[]
    lastUserId?: string
    lastOrganizationId?: string
}

export interface FindItem {
    id: string
    title: string
    info: string
    urlPicture: string
    type: string
    verified: boolean
}

interface FindAllParams {
    query: string
    take?: {
        users?: boolean
        organizations?: boolean
    }
    cursor?: {
        userId?: string
        organizationId?: string
    }
}

export async function apiFindAll({ query, take = { users: true, organizations: true }, cursor }: FindAllParams) {
    try {
        const result = await (
            await apiAuthenticated()
        ).get<FindItem[]>(`/find`, {
            params: {
                query,
                lastUserId: cursor?.userId,
                lastOrgId: cursor?.organizationId,
                organizations: take.organizations,
                users: take.users,
            },
        })

        if (!result) throw new Error('No result')

        return {
            itens: result.data,
            lastUserId: result.headers['last-user-id'],
            lastOrganizationId: result.headers['last-organization-id'],
        }
    } catch {
        return {
            itens: [],
        }
    }
}
