import { useEffect } from 'react'
import { Text } from 'react-native'
import { router } from 'expo-router'

import { readCache } from '../functions/cache'

export default function App() {
    useEffect(() => {
        redirect()
    }, [])

    const redirect = async () => {
        const { value } = await readCache('SAW_PRESENTATION')

        router.replace('/apresentation')

        // if (value) {
        // 	router.replace('/login')
        // } else {
        // 	router.replace('/apresentation')
        // }
    }

    return <Text>carregando...</Text>
}
