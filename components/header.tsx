import { View, Text } from 'react-native'
import { Button } from './button'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import { cn } from '../functions/utils'
import SafeView from './safeView'

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
        <View className={cn('bg-white', !!title && 'border-b border-stone-100')}>
            <View className="pb-2 relative items-center justify-center flex-row">
                {Left && <View className="absolute left-1 justify-center h-8 top-0 z-10">{Left}</View>}
                <View className="h-8 items-center justify-center flex-1">
                    <Text className="text-lg font-bold text-center">{title || ''}</Text>
                </View>
                {Right && <View className="absolute right-1 justify-center h-8 top-0 z-10">{Right}</View>}
            </View>
        </View>
    )
}
