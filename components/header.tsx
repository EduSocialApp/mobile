import { View, Text, SafeAreaView } from 'react-native'

interface Params {
    title?: string
    Left?: React.ReactNode
    Right?: React.ReactNode
}

export function Header({ title, Left, Right }: Params) {
    return (
        <SafeAreaView className="bg-white border-b border-stone-100">
            <View className="pb-2 relative items-center justify-center flex-row">
                {Left && <View className="absolute left-4 top-2">{Left}</View>}
                <Text className="text-lg font-bold">{title || 'titulo'}</Text>
                {Right && <View className="absolute right-4 top-2">{Right}</View>}
            </View>
        </SafeAreaView>
    )
}
