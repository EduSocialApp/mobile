import { apiAuthenticated } from '../route'

export interface UserOrganization {
    organization: {
        id: string
        name: string
        displayName: string
        biography: string
        email: string
        phone: string
        verified: boolean
        rejectedVerificationMessage?: string
        document: string
        documentType: string
        pictureUrl: string
        createdAt: Date
        updatedAt: Date
    }
    createdAt: Date
    role: string
    id: true
}

export async function apiUserOrganizations(id: string) {
    return (await apiAuthenticated()).get<UserOrganization[]>('/org/user/' + id)
}
