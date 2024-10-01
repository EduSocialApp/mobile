import { ActivityIndicator, View } from 'react-native'
import { Stack, router } from 'expo-router'

import { AuthContext, loadAuthenticated } from '../../hooks/authenticated'

export default function UsuarioLayout() {
    const [isLoading, session] = loadAuthenticated()

    if (isLoading) {
        return (
            <View className="items-center justify-center flex-1" style={{ gap: 18 }}>
                <ActivityIndicator size="large" color={'#b8b8b8'} />
            </View>
        )
    }

    if (!session?.user) {
        return router.replace('/login')
    }

    return (
        <AuthContext.Provider value={session}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
            </Stack>
        </AuthContext.Provider>
    )
}
