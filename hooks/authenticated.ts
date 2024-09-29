import { createContext, useContext, useEffect, useState } from 'react'
import { destroyAuthenticatedUser, destroyCredentialsInSecureStore, getAuthenticatedUser } from '../functions/authentication'

export type Session = {
    user: User
} | null

export const AuthContext = createContext<Session>({
    user: {
        name: '',
        email: '',
        pictureUrl: '',
        phone: '',
        id: '',
    },
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
export function loadAuthenticated(): [boolean, Session] {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session>(null)

    useEffect(() => {
        getAuthenticatedUser()
            .then((user) => {
                if (!user) throw new Error('User not found')

                setSession({ user })
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    return [loading, session]
}
