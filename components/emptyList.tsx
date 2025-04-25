import React from 'react'
import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Params {
    title?: string
    subtitle?: string
    icon?: string
}

export function EmptyList({
    title = 'Nada aqui ainda',
    subtitle = 'Parece que você não tem itens nesta lista. Comece a adicionar algo para ver aqui!',
}: Params) {
    return (
        <View className="flex-1 justify-center items-center p-5" style={{ gap: 20 }}>
            <View className="bg-stone-100 rounded-full p-5">
                <Feather name="inbox" size={80} color="#aaa" />
            </View>
            <View style={{ gap: 10 }}>
                <Text className="text-stone-700 font-bold text-center" style={{ fontSize: 22 }}>
                    {title}
                </Text>
                <Text className="text-stone-500 leading-5 text-center" style={{ fontSize: 16 }}>
                    {subtitle}
                </Text>
            </View>
        </View>
    )
}
