import { View, Text, TouchableOpacity } from 'react-native'
import { cn } from '../../functions/utils'

interface Props {
    value: boolean
    onChange: (value: boolean) => void
    label: string
    disabled?: boolean
}

export function Checkbox({ label, onChange, value, disabled }: Props) {
    return (
        <TouchableOpacity onPress={() => onChange(!value)} disabled={disabled} className="flex-row items-center">
            <View className="flex-row items-center" style={{ gap: 8 }}>
                <View
                    className={cn(
                        'p-1 bg-stone-200 w-[50] rounded-full flex-row justify-start',
                        value && 'bg-green-500 justify-end',
                        disabled && 'bg-stone-200'
                    )}>
                    <View className={cn('h-4 w-4 bg-stone-800 rounded-full', value && 'bg-white', disabled && 'bg-stone-400')} />
                </View>
                <Text className="text-stone-700">{label}</Text>
            </View>
        </TouchableOpacity>
    )
}
