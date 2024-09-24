import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { cn } from '../../functions/utils'

interface Params {
    onChange: (date: Date) => void
    value?: Date
    error?: string
}

function Error({ message }: { message: string }) {
    return <Text className="mt-1 text-red-500 font-bold ">{message}</Text>
}

export function DateInput({ onChange, error, value }: Params) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false)

    return (
        <View>
            <TouchableOpacity
                className={cn('bg-stone-100 h-16 px-6 rounded-lg justify-center', !!error && 'bg-red-50 text-red-500')}
                onPress={() => setDatePickerVisibility(true)}>
                <Text>{value ? value.toLocaleDateString('pt-BR') : <Text className="text-stone-500">Seu aniversário</Text>}</Text>
            </TouchableOpacity>
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
