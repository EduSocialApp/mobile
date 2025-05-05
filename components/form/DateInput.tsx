import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { cn } from '../../functions/utils'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Params {
    onChange: (date?: Date) => void
    value?: Date
    error?: string
    placeholder?: string
    size?: 'compact' | 'large'
    cleanable?: boolean
}

function Error({ message }: { message: string }) {
    return <Text className="mt-1 text-red-500 font-bold ">{message}</Text>
}

export function DateInput({ onChange, error, value, placeholder = 'Selecione uma data', size = 'large', cleanable = false }: Params) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false)

    return (
        <View>
            <View
                className={cn(
                    'bg-stone-100 h-16 px-6 rounded-lg justify-between flex-row items-center',
                    !!error && 'bg-red-50 text-red-500',
                    size === 'compact' && 'h-10 px-2'
                )}
                style={{ gap: 10 }}>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} className="flex-1 h-full justify-center">
                    <Text>{value ? value.toLocaleDateString('pt-BR') : <Text className="text-stone-500">{placeholder}</Text>}</Text>
                </TouchableOpacity>
                {value && cleanable && (
                    <TouchableOpacity onPress={() => onChange(undefined)}>
                        <MaterialCommunityIcons name="close" size={20} color={'#393939'} />
                    </TouchableOpacity>
                )}
            </View>
            {!!error && <Error message={error} />}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={value}
                onConfirm={(date) => {
                    onChange(date)
                    setDatePickerVisibility(false)
                }}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onCancel={() => setDatePickerVisibility(false)}
                locale="pt-BR"
                cancelTextIOS="Fechar"
                confirmTextIOS="Confirmar"
            />
        </View>
    )
}
