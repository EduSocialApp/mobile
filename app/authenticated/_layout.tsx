import { ActivityIndicator, View } from 'react-native'
import { Stack, router } from 'expo-router'

import { AuthContext, loadUser, logout } from '../../hooks/authenticated'

export default function UsuarioLayout() {
    const [isLoading, user] = loadUser()

    if (isLoading) {
        return (
            <View className="items-center justify-center flex-1" style={{ gap: 18 }}>
                <ActivityIndicator size="large" color={'#b8b8b8'} />
            </View>
        )
    }

    if (!user) {
        return router.replace('/login')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                logout: async () => {
                    await logout()
                    router.replace('/login')
                },
            }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
            </Stack>
        </AuthContext.Provider>
    )
}
