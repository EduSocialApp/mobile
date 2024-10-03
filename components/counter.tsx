import { View, Text } from 'react-native'

interface Params {
    title: string
    value: number
}

export function Counter({ title, value }: Params) {
    return (
        <View className="items-center">
            <Text className="font-bold text-base">{value}</Text>
            <Text>{title}</Text>
        </View>
    )
}
