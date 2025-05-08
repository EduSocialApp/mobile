import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { placeholderImage } from '../functions/placeholderImage'
import { cn } from '../functions/utils'
import { VerifiedBadge } from './verifiedBadge'

interface Params {
    title: string
    info?: string
    verified?: boolean
    urlPicture: string
    type?: 'user' | 'organization'
    photoSize?: 'xs' | 'sm' | 'md' | 'lg'
}

export function UserBasicView({ title, info, urlPicture, verified, type, photoSize = 'md' }: Params) {
    return (
        <View className="flex-row items-center flex-1">
            <Image
                source={{ uri: urlPicture }}
                placeholder={placeholderImage}
                className={cn('h-10 w-10 rounded-full', type === 'organization' && 'rounded-lg', photoSize === 'sm' && 'h-8 w-8')}
            />
            <View className="flex-1 ml-2">
                <View className="flex-row items-center" style={{ gap: 8 }}>
                    <Text className="font-semibold" style={{ fontSize: 16 }}>
                        {title}
                    </Text>
                    {verified && type && <VerifiedBadge type={type} />}
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
