import { useEffect } from 'react'
import { Text } from 'react-native'
import { router } from 'expo-router'
import { configure } from 'axios-hooks'

import { CacheKey, readCache } from '../functions/cache'
import { apiAxios } from '../functions/api'

configure({
	axios: apiAxios
})

export default function App() { 

	useEffect(() => {
		redirect()
	}, [])

	const redirect = async () => {
		const { value } = await readCache(CacheKey.sawPresentation)
		
		if (value) {
			router.replace('/login')
		} else {
			router.replace('/apresentation')
		}
	}

	return (
		<Text>carregando...</Text>
	)
}