import { View, Text } from 'react-native'
import { cn } from '../functions/utils'
import { Image } from 'expo-image'

interface Params {
    text?: string
    numberOfLines?: number
    theme?: 'white' | 'primary' | 'default'
    direction?: 'top' | 'bottom' | 'left' | 'right'
    contact?: Contact
}

export function TextBubble({ text = 'Insira um texto', numberOfLines, theme = 'default', direction = 'left', contact }: Params) {
    return (
        <View className="flex-row max-w-[85%] w-full" style={{ gap: 8 }}>
            {contact && (
                <View>
                    <Image
                        source={{
                            uri: contact.pictureUrl,
                        }}
                        className="h-10 w-10 rounded-full"
                    />
                </View>
            )}
            <View
                className={cn(
                    'relative bg-stone-100 px-4 py-2 rounded-lg  flex-row',
                    theme === 'white' && 'bg-white',
                    theme === 'primary' && 'bg-tertiary'
                )}>
                <Text className="text-stone-800 text-sm" numberOfLines={numberOfLines}>
                    {text}
                </Text>
            </View>
        </View>
    )
}
