import { api } from '../route'

export function apiUserRegister({ fullname, displayName, date, email, password, permissions }: RegisterUser) {
    return api.post<{
        id: string
        createdAt: string
    }>('/user/register', {
        name: fullname,
        displayName,
        password,
        email,
        birthday: date,
        pictureUrl: '',
        phone: '',
        permissions,
    })
}
