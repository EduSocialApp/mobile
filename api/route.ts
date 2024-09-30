import Axios from 'axios'
import { getCredentialsFromSecureStore } from '../functions/authentication'

export const api = Axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
})

export async function apiAuthenticated() {
    const credentials = await getCredentialsFromSecureStore()

    return Axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${credentials?.accessToken}`,
        },
    })
}
