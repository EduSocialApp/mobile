import { api, apiAuthenticated } from '../route'

interface RegisterOrganization {
    name: string
    displayName: string
    email: string
    document: string
    phone: string
    pictureUrl: string
    address: {
        street: string
        number: string
        neighborhood: string
        city: string
        state: string
        country: string
        zipCode: string
        ibgeCode: string
        complement: string
    }
}

export async function apiOrganizationRegister(data: RegisterOrganization) {
    return (await apiAuthenticated()).post<{
        id: string
        createdAt: string
    }>('/org/create', data)
}
