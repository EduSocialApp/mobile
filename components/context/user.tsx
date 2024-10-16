import { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import { ActivityIndicator, View, Text } from 'react-native'
import { useUserAuthenticated } from '../../hooks/authenticated'
import { apiGetUserById } from '../../api/user/get'
import { UserContext } from '../../hooks/user'

interface Params {
    id: string
    children: React.ReactNode
}

export function UserProvider({ id, children }: Params) {
    const loggedUser = useUserAuthenticated()?.user
    if (!loggedUser) return null

    const [loading, setLoading] = useState<string | undefined>('user')
    const [user, setUser] = useState<User>()

    useEffect(() => {
        handleUser()
    }, [])

    const handleUser = () => {
        setLoading('user')
        debounce(fetchUser, 100)()
    }

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
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#c5c5c5" />
            </View>
        )
    }

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Usuário não encontrado</Text>
            </View>
        )
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
