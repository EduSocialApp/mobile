import { RegisterUser } from '../../app/createAccount/types'
import { api } from '../route'

export function apiUserRegister({ fullname, date, email, password, permissions }: RegisterUser) {
    return api.post<{
        id: string
        createdAt: string
    }>('/user/register', {
        name: fullname,
        password,
        email,
        birthday: date,
        pictureUrl: '',
        phone: '',
        permissions,
    })
}
