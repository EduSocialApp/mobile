import { apiAuthenticated } from '../route'

interface Params {
    name: string
    displayName: string
    biography: string
}

export async function apiUpdateProfileInformations(id: string, values: Params) {
    return await (await apiAuthenticated()).patch('/user/' + id, values)
}
