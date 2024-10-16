import { apiAuthenticated } from '../../route'

export interface LinkSupervisedUser {
    supervisedUserId: string
    updatedAt: string
    supervisedUser: {
        id: string
        name: string
        displayName: string
        pictureUrl: string
        biography: string
    }
}

export async function apiGetSupervisedUsers() {
    return (await apiAuthenticated()).get<LinkSupervisedUser[]>(`/user/supervisedUsers`)
}
