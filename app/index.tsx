import { useEffect } from 'react'
import { Text } from 'react-native'
import { router } from 'expo-router'

import { getCredentialsFromSecureStore } from '../functions/authentication'

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
