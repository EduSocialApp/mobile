import { createContext, useContext, useEffect, useState } from 'react'
import { destroyAuthenticatedUser, destroyCredentialsInSecureStore, getAuthenticatedUser, saveAuthenticatedUser } from '../functions/authentication'
import { apiGetUserById } from '../api/user/get'

export type Session = {
    user?: User
}

export const AuthContext = createContext<Session>({})

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
export function loadAuthenticated(): [boolean, Session] {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session>({})

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setLoading(true)
        try {
            const userDataRequest = await apiGetUserById()
            if (!userDataRequest.data) throw new Error('User not found')

            await saveAuthenticatedUser(userDataRequest.data)

            setSession({ user: userDataRequest.data })

            setLoading(false)
        } catch {
            destroyAuthenticatedUser()
            destroyCredentialsInSecureStore()
            setLoading(false)
        }
    }

    return [loading, session]
}
