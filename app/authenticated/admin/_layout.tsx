import { View, Text } from 'react-native'
import { router, Stack } from 'expo-router'
import { useUserAuthenticated } from '../../../hooks/authenticated'

export default function Layout() {
    const session = useUserAuthenticated()

    if (!session?.user) {
        return router.replace('/login')
    }

    // Checa se o usuário é admin ou moderador
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
        return router.replace('/authenticated/profile')
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    )
}
