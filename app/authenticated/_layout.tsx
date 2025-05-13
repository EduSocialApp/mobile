import { ActivityIndicator, View } from 'react-native'
import { Stack, router } from 'expo-router'

import { AuthContext, loadUser, logout } from '../../hooks/authenticated'
import { useEffect } from 'react'

export default function UsuarioLayout() {
    const [isLoading, user] = loadUser()

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login')
        }
    }, [isLoading, user])

    if (isLoading || !user) {
        return (
            <View className="items-center justify-center flex-1" style={{ gap: 18 }}>
                <ActivityIndicator size="large" color={'#b8b8b8'} />
            </View>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                logout: async () => {
                    await logout()
                    router.replace('/login')
                },
                isAdmin: user.role === 'ADMIN',
                isModerator: user.role === 'MODERATOR' || user.role === 'ADMIN',
            }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
            </Stack>
        </AuthContext.Provider>
    )
}
