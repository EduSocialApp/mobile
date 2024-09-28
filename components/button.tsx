import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { cn } from '../functions/utils'

interface Params {
    onPress: () => void
    text?: string
    variant?: 'default' | 'primary' | 'secondary' | 'link'
    children?: React.ReactNode
    className?: string
    loading?: boolean
}

export function Button({ onPress, text, variant = 'default', children, className, loading }: Params) {
    const Content = children || (
        <Text className={cn('text-white font-semibold', variant === 'primary' && 'text-headline', variant === 'link' && 'text-headline')}>
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
                'bg-headline p-4 rounded-lg items-center',
                variant === 'primary' && 'bg-primary',
                variant === 'link' && 'p-0 bg-inherit',
                loading && 'bg-stone-200',
                className
            )}
            disabled={loading}>
            {loading ? LoadingContent : Content}
        </TouchableOpacity>
    )
}
