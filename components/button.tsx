import { TouchableOpacity, Text } from 'react-native'
import { cn } from '../functions/utils'

interface Params {
    onPress: () => void
    text?: string
    variant?: 'default' | 'primary' | 'secondary'
}

export function Button({ onPress, text, variant = 'default' }: Params) {
    return (
        <TouchableOpacity onPress={onPress} className={cn('bg-headline p-4 rounded-lg items-center', variant === 'primary' && 'bg-primary')}>
            <Text className={cn('text-white font-semibold', variant === 'primary' && 'text-headline')}>{text}</Text>
        </TouchableOpacity>
    )
}
