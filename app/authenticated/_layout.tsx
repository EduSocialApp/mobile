import { Text } from 'react-native'
import { Stack, router } from 'expo-router'

import { AuthContext, loadAuthenticated } from '../../hooks/authenticated'

export default function UsuarioLayout() {
    const [isLoading, session] = loadAuthenticated()

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    if (!session?.user) {
        return router.replace('/login')
    }

    return (
        <AuthContext.Provider value={session}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="menu"
            />
        </AuthContext.Provider>
    )
}
