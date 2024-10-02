import { apiAuthenticated } from '../route'

export interface OrganizationWaitingAnalysis {
    id: string
    name: string
    email: string
    phone: string
    verified: boolean
    rejectedVerificationMessage?: string
    document: string
    documentType: string
    pictureUrl: string
    createdAt: string
    updatedAt: string
    addresses: {
        address: {
            id: string
            street: string
            number: string
            complement: string
            neighborhood: string
            city: string
            state: string
            country: string
            zipCode: string
            ibgeCode: string
            geolocation: string
            createdAt: string
            updatedAt: string
        }
    }[]
    members: {
        id: string
        role: string
        updatedAt: string
        user: {
            id: string
            name: string
            email: string
            document: string
            documentType: string
            emailVerified: boolean
            pictureUrl: string
            phone: string
            createdAt: string
        }
    }[]
}

export async function apiWaitingAnalysis() {
    return (await apiAuthenticated()).get<OrganizationWaitingAnalysis[]>('/org/waitingAnalysis')
}
