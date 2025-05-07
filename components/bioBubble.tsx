import { View, Text } from 'react-native'

interface Params {
    text?: string
    numberOfLines?: number
}

export function BioBubble({ text = 'Insira um texto', numberOfLines = 2 }: Params) {
    return (
        <View className="relative bg-stone-100 px-4 py-2 rounded-lg max-w-[85%]">
            <Text className="text-stone-600 text-sm" numberOfLines={numberOfLines}>
                {text}
            </Text>

            {/* Triângulo do balão, apontando para a esquerda */}
            <View
                className="absolute left-[-4px] top-3 w-2 h-2 bg-stone-100"
                style={{
                    transform: [{ rotate: '45deg' }],
                }}
            />
        </View>
    )
}
