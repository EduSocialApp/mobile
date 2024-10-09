import { apiAuthenticated } from '../route'

export async function apiMemberRejectOrganization(id: string) {
    return (await apiAuthenticated()).post<{ message: string }>(`/org/member/${id}/unlink`)
}
