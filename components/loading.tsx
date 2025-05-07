import { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { selectRandomTextFromList } from '../functions/selectRandomTextFromList'

interface Params {
    texts?: string[]
}

export function LoadingScreen({
    texts = ['Carregando conteúdo', 'Aguarde um momento', 'Estamos buscando as informações', 'Por favor, aguarde'],
}: Params) {
    const [text, setText] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setText(selectRandomTextFromList(texts))
        }, 1500)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <View className="flex-1 items-center justify-center" style={{ gap: 12 }}>
            <ActivityIndicator color="#000000" />
            {!!text && <Text className="text-stone-600">{text}</Text>}
        </View>
    )
}
