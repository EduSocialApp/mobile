import { TextInput as TextInputRc, TextInputProps, View, Text, TouchableOpacity } from 'react-native'
import { cn } from '../../functions/utils'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'

interface Params {
    onChangeText: (text: string) => void
    value: string
    placeholder?: TextInputProps['placeholder']
    autoCapitalize?: TextInputProps['autoCapitalize']
    textContentType?: TextInputProps['textContentType']
    keyboardType?: TextInputProps['keyboardType']
    secureTextEntry?: TextInputProps['secureTextEntry']
    PrefixChild?: React.ReactNode
    SuffixChild?: React.ReactNode
    error?: string
    help?: string
    className?: string
    editable?: boolean
}

function Error({ message }: { message: string }) {
    return <Text className="mt-1 text-red-500 font-bold ">{message}</Text>
}

export function TextInput({
    onChangeText,
    keyboardType,
    value,
    placeholder,
    autoCapitalize,
    textContentType,
    error,
    secureTextEntry,
    PrefixChild,
    SuffixChild,
    className,
    editable = true,
    help,
}: Params) {
    return (
        <View>
            <View
                className={cn(
                    'flex-row justify-between items-center bg-stone-100 h-16 px-6 rounded-lg',
                    !!error && 'bg-red-50 text-red-500',
                    className
                )}
                style={{ gap: 16 }}>
                {PrefixChild}
                <TextInputRc
                    className="flex-1"
                    placeholderTextColor={'#78716c'}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                    textContentType={textContentType}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    style={{ color: editable ? 'black' : '#555555' }}
                />
                {SuffixChild}
            </View>

            {!!error && <Error message={error} />}
            {!!help && <Text className="mt-1 text-gray-500">{help}</Text>}
        </View>
    )
}

export function PasswordInput(params: Params) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <TextInput
            {...params}
            secureTextEntry={!showPassword}
            SuffixChild={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="black" />
                </TouchableOpacity>
            }
        />
    )
}
