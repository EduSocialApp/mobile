import { router } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface DataNotFoundProps {
    text?: string
    backButton?: boolean
}

export function DataNotFound({ text = 'Nenhum dado encontrado', backButton = true }: DataNotFoundProps) {
    return (
        <View className="flex-1 items-center justify-center px-6" style={{ gap: 20 }}>
            <View className="items-center">
                <MaterialIcons name="search-off" size={64} color="#a3a3a3" />
                <Text className="text-stone-600 text-center mt-4" style={{ fontSize: 18 }}>
                    {text}
                </Text>
            </View>

            {backButton && (
                <TouchableOpacity onPress={() => router.back()} className="bg-black px-6 py-3 rounded-full">
                    <Text className="text-white font-medium text-center">Voltar</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}
