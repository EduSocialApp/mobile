import { router } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface DataNotFoundProps {
    text?: string
    description?: string
    backButton?: boolean
    Icon?: React.ReactNode
}

export function DataNotFound({
    text = 'Nenhum dado encontrado',
    backButton,
    description,
    Icon = <MaterialIcons name="search-off" size={64} color="#dcdcdc" />,
}: DataNotFoundProps) {
    return (
        <View className="flex-1 items-center justify-center p-5" style={{ gap: 18 }}>
            {Icon}

            <View style={{ gap: 4 }}>
                <Text className="text-stone-500 text-center font-bold">{text}</Text>
                {description && <Text className="text-stone-500 text-center">{description}</Text>}
            </View>

            {backButton && (
                <TouchableOpacity onPress={() => router.back()} className="bg-black px-6 py-3 rounded-full">
                    <Text className="text-white font-medium text-center">Voltar</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}
