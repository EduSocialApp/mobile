import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { cn } from '../functions/utils'

interface Params {
    onPress: () => void
    text?: string
    variant?: 'default' | 'primary' | 'secondary' | 'link' | 'outline' | 'ghost' | 'white'
    size?: 'sm' | 'md' | 'lg'
    children?: React.ReactNode
    className?: string
    loading?: boolean
}

export function Button({ onPress, text, variant = 'default', children, className, loading, size = 'md' }: Params) {
    const Content = children || (
        <Text
            className={cn(
                'text-white font-semibold px-2',
                variant === 'primary' && 'text-headline',
                variant === 'link' && 'text-headline',
                variant === 'outline' && 'text-headline',
                variant === 'ghost' && 'text-stone-900',
                variant === 'white' && 'text-black'
            )}>
            {text}
        </Text>
    )

    const LoadingContent = (
        <View>
            <ActivityIndicator color="#6b6b6b" />
        </View>
    )

    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                'bg-headline min-h-[50] min-w-[50] rounded-lg flex-row items-center justify-center',
                className,
                size === 'sm' && 'min-h-[40] min-w-[40]',
                size === 'md' && 'min-h-[50] min-w-[50]',
                size === 'lg' && 'min-h-[60] min-w-[60]',
                variant === 'primary' && 'bg-primary',
                variant === 'link' && 'p-0 min-h-0 min-w-0 bg-inherit',
                variant === 'outline' && 'bg-white border-2 border-headline',
                variant === 'ghost' && 'bg-stone-50',
                variant === 'white' && 'bg-white',
                loading && 'bg-stone-200'
            )}
            style={{ gap: 10 }}
            disabled={loading}>
            {loading ? LoadingContent : Content}
        </TouchableOpacity>
    )
}
