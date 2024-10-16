import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { Badge } from './badge'

interface Params {
    title: string
    info?: string
    badge?: string
    urlPicture: string
}

export function UserBasicView({ title, info, urlPicture, badge }: Params) {
    return (
        <View className="flex-row items-center flex-1">
            <Image source={{ uri: urlPicture }} className="h-10 w-10 rounded-full" />
            <View className="flex-1 ml-2">
                <View className="flex-1 flex-row items-center" style={{ gap: 12 }}>
                    <Text className="font-semibold" style={{ fontSize: 16 }}>
                        {title}
                    </Text>
                    {badge && <Badge title={badge} variant="inactive" />}
                </View>
                {!!info && (
                    <Text numberOfLines={1} className="text-stone-500">
                        {info}
                    </Text>
                )}
            </View>
        </View>
    )
}
