import { apiAuthenticated } from '../route'

export interface NotificationsQuantity {
    total: number
    pendingOrganizations: number
}

export async function apiGetHasNewNotifications() {
    return (await apiAuthenticated()).get<NotificationsQuantity>(`/user/totalNotifications`)
}
