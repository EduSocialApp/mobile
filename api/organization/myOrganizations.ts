import { apiAuthenticated } from '../route'

export interface MyOrganization {
    organization: {
        id: string
        name: string
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
