import { apiAuthenticated } from '../route'

export async function apiMemberAcceptOrganization(id: string) {
    return (await apiAuthenticated()).post<{ message: string }>(`/org/member/${id}/approve`)
}
