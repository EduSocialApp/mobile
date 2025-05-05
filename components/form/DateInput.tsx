import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { cn } from '../../functions/utils'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { dateShort, dateTimeShort, timeShort } from '../../functions/date/dateFormat'

interface Params {
    onChange: (date?: Date | null) => void
    value?: Date | null
    error?: string
    placeholder?: string
    size?: 'compact' | 'large'
    cleanable?: boolean
    mode?: 'date' | 'time' | 'datetime'
}

function Error({ message }: { message: string }) {
    return <Text className="mt-1 text-red-500 font-bold ">{message}</Text>
}

function printDate(date: Date, mode: 'date' | 'time' | 'datetime') {
    const isoString = date.toISOString()

    if (mode === 'date') {
        return dateShort(isoString)
    }

    if (mode === 'time') {
        return timeShort(isoString)
    }

    return dateTimeShort(isoString)
}

export function DateInput({ onChange, error, value, placeholder = 'Selecione uma data', size = 'large', cleanable = false, mode = 'date' }: Params) {
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
                    <Text>{value ? printDate(value, mode) : <Text className="text-stone-500">{placeholder}</Text>}</Text>
                </TouchableOpacity>
                {value && cleanable && (
                    <TouchableOpacity onPress={() => onChange(null)}>
                        <MaterialCommunityIcons name="close" size={20} color={'#393939'} />
                    </TouchableOpacity>
                )}
            </View>
            {!!error && <Error message={error} />}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                date={value ? value : undefined}
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
