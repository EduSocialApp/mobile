import { apiAuthenticated } from '../route'

export interface MyOrganization {
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
}

export async function apiMyOrganizations() {
    return (await apiAuthenticated()).get<MyOrganization[]>('/org/my')
}
