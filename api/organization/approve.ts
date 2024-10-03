import { apiAuthenticated } from '../route'

export async function apiApproveOrganization(id: string) {
    return (await apiAuthenticated()).post<{ message: string }>(`/org/${id}/approve`)
}
