import Axios from 'axios'

import { getCredentialsFromSecureStore, saveCredentialsInSecureStore } from '../functions/authentication'
import { router } from 'expo-router'
import { notificationDevice } from '../functions/notification'
import { apiUrl } from './url'

export const api = Axios.create({
    baseURL: apiUrl,
})

function renewLogin({ deviceName, notificationToken, refreshToken }: { deviceName: string; notificationToken: string; refreshToken: string }) {
    return api.patch<{
        accessToken: string
        expirationDate: Date
    }>('/user/login', {
        refreshToken,
        notificationToken,
        deviceName,
    })
}

export async function apiAuthenticated() {
    const credentials = await getCredentialsFromSecureStore()

    // Verifica se as credenciais estão expiradas
    try {
        if (!credentials) throw new Error('Credenciais não encontradas')

        if (credentials.expirationDate < new Date()) {
            // Tenta renovar
            try {
                const { deviceName, notificationToken } = await notificationDevice()
                const {
                    data: { accessToken, expirationDate },
                } = await renewLogin({ refreshToken: credentials.refreshToken, deviceName, notificationToken })

                const newCredentials = {
                    accessToken,
                    refreshToken: credentials.refreshToken,
                    expirationDate,
                }

                await saveCredentialsInSecureStore(newCredentials.accessToken, newCredentials.refreshToken, newCredentials.expirationDate)

                // Tenta criar uma nova instância da apir
                return await apiAuthenticated()
            } catch {
                throw new Error('Erro ao renovar token')
            }
        }
    } catch {
        router.replace('/login')
        throw new Error('Erro ao pegar credenciais')
    }

    return Axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${credentials?.accessToken}`,
        },
    })
}
