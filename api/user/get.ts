import { apiAuthenticated } from '../route'

export async function apiGetUserById(id = 'me') {
    return (await apiAuthenticated()).get<User>(`/user/${id}`)
}
