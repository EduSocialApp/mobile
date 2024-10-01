import { View, Text, SafeAreaView } from 'react-native'
import { Button } from './button'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'

interface Params {
    title?: string
    Left?: React.ReactNode
    Right?: React.ReactNode
    backButton?: boolean
}

export function Header({ title, Left, Right, backButton }: Params) {
    if (backButton) {
        Left = (
            <Button onPress={() => router.back()} variant="link">
                <Entypo name="chevron-left" size={24} color="black" />
            </Button>
        )
    }

    return (
        <SafeAreaView className="bg-white border-b border-stone-100">
            <View className="pb-2 relative items-center justify-center flex-row">
                {Left && <View className="absolute left-4 justify-center h-8 top-0 z-10">{Left}</View>}
                <View className="h-8 items-center justify-center flex-1">
                    <Text className="text-lg font-bold text-center">{title || 'titulo'}</Text>
                </View>
                {Right && <View className="absolute right-4 justify-center h-8 top-0 z-10">{Right}</View>}
            </View>
        </SafeAreaView>
    )
}
