import { createContext, useContext, useEffect, useState } from 'react'
import { destroyAuthenticatedUser, destroyCredentialsInSecureStore, getAuthenticatedUser, saveAuthenticatedUser } from '../functions/authentication'
import { apiGetUserById } from '../api/user/get'

export type Session = {
    user?: User
    logout: () => void
}

export const AuthContext = createContext<Session>({
    logout: () => {},
})

/**
 * Cria contexto com o usuario autenticado
 */
export function useUserAuthenticated() {
    return useContext(AuthContext)
}

/**
 * Limpa todos os dados do aplicativo
 */
export async function logout() {
    await destroyCredentialsInSecureStore()
    await destroyAuthenticatedUser()
}

/**
 * Carrega o usuario autenticado
 */
export function loadUser(): [boolean, User | undefined] {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setLoading(true)
        try {
            const userDataRequest = await apiGetUserById()
            if (!userDataRequest.data) throw new Error('User not found')

            await saveAuthenticatedUser(userDataRequest.data)

            setUser(userDataRequest.data)

            setLoading(false)
        } catch {
            destroyAuthenticatedUser()
            destroyCredentialsInSecureStore()
            setLoading(false)
        }
    }

    return [loading, user]
}
