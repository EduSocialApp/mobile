import { apiAuthenticated } from '../route'

interface Params {
    id: string
}

export async function apiGetOrganizationAddresses({ id }: Params): Promise<Address[]> {
    try {
        const result = await (await apiAuthenticated()).get<Address[]>(`/org/${id}/addresses`)

        if (!result) throw new Error('No result')

        return result.data || []
    } catch {
        return []
    }
}
