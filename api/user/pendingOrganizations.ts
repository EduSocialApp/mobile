import { apiAuthenticated } from '../route'

interface Response {
    id: string
    organizations: PendingOrganization[]
}

export interface PendingOrganization {
    id: string
    role: string
    organization: {
        id: string
        displayName: string
        verified: boolean
        pictureUrl: string
        name: string
        biography: string
    }
}

export async function apiGetPendingOrganizations() {
    return (await apiAuthenticated()).get<Response>(`/user/pendingOrganizations`)
}
