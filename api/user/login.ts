import { api } from '../route'

interface Params {
    email: string
    password: string
    notificationToken: string
    deviceName: string
}

export function apiUserLogin({ email, password, notificationToken, deviceName }: Params) {
    return api.post<{
        accessToken: string
        refreshToken: string
        expirationDate: Date
    }>('/user/login', {
        email,
        password,
        notificationToken,
        deviceName,
    })
}
