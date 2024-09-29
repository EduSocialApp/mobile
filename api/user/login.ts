import { api } from '../route'

interface Params {
    email: string
    password: string
}

export function apiUserLogin({ email, password }: Params) {
    return api.post<{
        accessToken: string
        refreshToken: string
    }>('/user/login', {
        email,
        password,
    })
}
