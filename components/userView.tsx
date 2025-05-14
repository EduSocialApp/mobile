import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { placeholderImage } from '../functions/placeholderImage'
import { cn } from '../functions/utils'
import { VerifiedBadge } from './verifiedBadge'

export interface UserViewProps {
    title: string
    info?: string
    verified?: boolean
    urlPicture: string
    type?: 'user' | 'organization'
    photoSize?: 'xs' | 'sm' | 'md' | 'lg'
    numberLinesInfo?: number
    rightTopText?: string
}

export function UserView({ title, info, urlPicture, verified, type, photoSize = 'md', numberLinesInfo = 1, rightTopText }: UserViewProps) {
    return (
        <View className="flex-row items-center flex-1">
            <Image
                source={{ uri: urlPicture }}
                placeholder={placeholderImage}
                className={cn('h-10 w-10 rounded-full', type === 'organization' && 'rounded-lg', photoSize === 'sm' && 'h-8 w-8')}
            />
            <View className="flex-1 ml-2">
                <View className="flex-row items-start justify-between" style={{ gap: 8 }}>
                    <View className="flex-row items-center" style={{ gap: 8 }}>
                        <Text className="font-semibold" style={{ fontSize: 16 }}>
                            {title}
                        </Text>
                        {verified && type && <VerifiedBadge type={type} />}
                    </View>
                    {rightTopText && (
                        <Text className="text-xs text-stone-500" style={{ fontSize: 12 }}>
                            {rightTopText}
                        </Text>
                    )}
                </View>
                {!!info && (
                    <Text numberOfLines={numberLinesInfo} className="text-stone-500">
                        {info}
                    </Text>
                )}
            </View>
        </View>
    )
}
