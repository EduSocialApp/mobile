import { apiAuthenticated } from '../route'

export interface OrganizationSimple {
    id: string
    name: string
    displayName: string
    biography: string
    email: string
    phone: string
    verified: boolean
    rejectedVerificationMessage: null
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
    owners?: {
        id: string
        updatedAt: string
        user: {
            id: string
            name: string
            email: string
            pictureUrl: string
        }
    }[]
}

export async function apiOrganizationFindById(id: string) {
    return (await apiAuthenticated()).get<OrganizationSimple>('/org/' + id)
}
