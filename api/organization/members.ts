import { apiAuthenticated } from '../route'

export interface OrganizationMember {
    user: {
        id: string
        name: string
        displayName: string
        pictureUrl: string
    }
    role: string
}

interface OrganizationMembersResult {
    itens: OrganizationMember[]
    lastOrganizationMemberId?: string
}

export async function apiOrganizationMembers(id: string, cursor?: string) {
    try {
        const result = await (
            await apiAuthenticated()
        ).get<OrganizationMember[]>(`/org/${id}/members`, {
            params: {
                lastOrganizationMemberId: cursor,
            },
        })

        if (!result) throw new Error('No result')

        return {
            itens: result.data,
            lastOrganizationMemberId: result.headers['last-organizationmember-id'],
        }
    } catch {
        return {
            itens: [],
        }
    }
}
