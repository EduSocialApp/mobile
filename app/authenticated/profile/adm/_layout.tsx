import { router, Stack } from 'expo-router'
import { useUserAuthenticated } from '../../../../hooks/authenticated'
import { useEffect } from 'react'

export default function Layout() {
    const session = useUserAuthenticated()

    useEffect(() => {
        if (!session) return

        if (!session.user) {
            router.replace('/login')
            return
        }

        if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
            router.replace('/authenticated/profile')
        }
    }, [session])

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    )
}
