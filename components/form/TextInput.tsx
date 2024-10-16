import { TextInput as TextInputRc, TextInputProps, View, Text, TouchableOpacity } from 'react-native'
import { cn } from '../../functions/utils'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'

interface Params {
    onChangeText: (text: string) => void
    value: string
    title?: string
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
    size?: 'sm' | 'md' | 'lg'
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
    title,
    size = 'md',
}: Params) {
    const sizes = (sm: number, md: number, lg: number) => {
        return { sm, md, lg }[size]
    }

    return (
        <View>
            {!!title && (
                <View className="mb-1 mx-2">
                    <Text className="font-semibold">{title}</Text>
                </View>
            )}

            <View
                className={cn(
                    'flex-row justify-between items-center bg-stone-100 px-6 rounded-lg',
                    !!error && 'bg-red-50 text-red-500',
                    size === 'sm' && 'px-4',
                    className,
                )}
                style={{ gap: sizes(8, 16, 18) }}>
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
                    style={{ color: editable ? 'black' : '#555555', height: sizes(40, 64, 64) }}
                />
                {SuffixChild}
            </View>

            {!!error && <Error message={error} />}
            {!!help && <Text className="mt-1 text-gray-500 text-xs">{help}</Text>}
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
