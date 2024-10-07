import { apiAuthenticated } from '../route'

export async function apiOrganizationRole(id: string) {
    return (await apiAuthenticated()).get<{ role: string }>(`/org/${id}/role`)
}
