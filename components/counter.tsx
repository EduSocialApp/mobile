import { View, Text } from 'react-native'

interface Params {
    title: string
    value: number
}

export function Counter({ title, value }: Params) {
    return (
        <View className="items-center bg-stone-100 flex-1 p-2 rounded-lg">
            <Text className="font-bold text-base">{value}</Text>
            <Text>{title}</Text>
        </View>
    )
}
