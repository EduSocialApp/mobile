import { View, Text } from 'react-native'
import { cn } from '../functions/utils'

interface Props {
    title: string
    variant?: 'primary' | 'secondary' | 'inactive' | 'danger'
}

export function Badge({ title, variant = 'primary' }: Props) {
    return (
        <View
            className={cn(
                'rounded-md px-4 p-1',
                variant === 'primary' && 'bg-black',
                variant === 'inactive' && 'bg-stone-300',
                variant === 'danger' && 'bg-red-500'
            )}>
            <Text className={cn('text-white font-bold px-2', variant === 'inactive' && 'text-stone-500')} style={{ fontSize: 12 }}>
                {title}
            </Text>
        </View>
    )
}
