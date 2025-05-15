import { useCallback, useRef, useState } from 'react'
import { useUserAuthenticated } from '../../hooks/authenticated'
import { apiGetUserById } from '../../api/user/get'
import { UserContext } from '../../hooks/user'
import { LoadingScreen } from '../loading'
import { DataNotFound } from '../404'
import { useFocusEffect } from 'expo-router'

interface Params {
    id: string
    children: React.ReactNode
}

export function UserProvider({ id, children }: Params) {
    const loggedUser = useUserAuthenticated()?.user
    if (!loggedUser) return null

    const [loading, setLoading] = useState<string | undefined>('user')
    const [user, setUser] = useState<User>()

    const debounce = useRef<NodeJS.Timeout>(undefined)

    const handleUser = useCallback(() => {
        setLoading('user')

        clearTimeout(debounce.current)

        debounce.current = setTimeout(() => {
            fetchUser()
        }, 100)
    }, [])

    useFocusEffect(
        useCallback(() => {
            handleUser()

            return () => {
                clearTimeout(debounce.current)
            }
        }, [handleUser])
    )

    const fetchUser = async () => {
        setLoading('user')
        try {
            const { data } = await apiGetUserById(id)
            setUser(data)
        } catch (error) {
            setUser(undefined)
        }

        // Espera 1 segundo para remover o loading (para evitar flickering)
        setLoading(undefined)
    }

    if (loading === 'user') {
        return <LoadingScreen />
    }

    if (!user) {
        return <DataNotFound text="Usuário não encontrado" />
    }

    const myProfile = user.id === loggedUser.id
    const isModerator = user.role === 'ADMIN' || user.role === 'MODERATOR'

    return (
        <UserContext.Provider
            value={{
                user,
                myProfile,
                isModerator,
                refresh: handleUser,
            }}>
            {children}
        </UserContext.Provider>
    )
}
