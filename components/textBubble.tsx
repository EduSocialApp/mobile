import { View, Text } from 'react-native'
import { cn } from '../functions/utils'

interface Params {
    text?: string
    numberOfLines?: number
    theme?: 'white' | 'primary' | 'default'
    direction?: 'top' | 'bottom' | 'left' | 'right'
}

export function TextBubble({ text = 'Insira um texto', numberOfLines, theme = 'default', direction = 'left' }: Params) {
    return (
        <View
            className={cn(
                'relative bg-stone-100 px-4 py-2 rounded-lg max-w-[85%]',
                theme === 'white' && 'bg-white',
                theme === 'primary' && 'bg-tertiary'
            )}>
            <Text className="text-stone-800 text-sm" numberOfLines={numberOfLines}>
                {text}
            </Text>

            {/* Triângulo do balão, apontando para a esquerda */}
            <View
                className={cn(
                    'absolute left-[-4px] top-3 w-2 h-2 bg-stone-100',
                    theme === 'white' && 'bg-white',
                    theme === 'primary' && 'bg-tertiary',
                    direction === 'right' && 'left-auto right-[-4px]'
                )}
                style={{
                    transform: [{ rotate: '45deg' }],
                }}
            />
        </View>
    )
}
