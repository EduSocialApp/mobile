import { useEffect } from 'react'
import { Text } from 'react-native'
import { router } from 'expo-router'
import * as Notifications from 'expo-notifications'

import { getCredentialsFromSecureStore } from '../functions/authentication'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

export default function App() {
    useEffect(() => {
        redirect()
    }, [])

    const redirect = async () => {
        const credentials = await getCredentialsFromSecureStore()

        if (credentials) {
            router.replace('/authenticated')
            return
        }

        router.replace('/apresentation')
    }

    return <Text>carregando...</Text>
}
