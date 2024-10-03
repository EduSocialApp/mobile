import { apiAuthenticated } from '../route'

export async function apiRejectOrganization(id: string, reason: string = '') {
    return (await apiAuthenticated()).post<{ message: string }>(`/org/${id}/reject`, {
        reason,
    })
}
