import Axios from 'axios'

export const api = Axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
})

export default function apiAuthenticated() {
    return Axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: {
            Authorization: 'Bearer ',
        },
    })
}
