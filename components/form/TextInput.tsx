import { TextInput as TextInputRc, TextInputProps, View, Text } from 'react-native'
import { cn } from '../../functions/utils'

interface Params {
    onChangeText: (text: string) => void
    value: string
    placeholder?: TextInputProps['placeholder']
    autoCapitalize?: TextInputProps['autoCapitalize']
    textContentType?: TextInputProps['textContentType']
    keyboardType?: TextInputProps['keyboardType']
    secureTextEntry?: TextInputProps['secureTextEntry']
    error?: string
}

function Error({ message }: { message: string }) {
    return <Text className="mt-1 text-red-500 font-bold ">{message}</Text>
}

export function TextInput({ onChangeText, keyboardType, value, placeholder, autoCapitalize, textContentType, error, secureTextEntry }: Params) {
    return (
        <View>
            <TextInputRc
                className={cn('bg-stone-100 h-16 px-6 rounded-lg', !!error && 'bg-red-50 text-red-500')}
                placeholderTextColor={'#78716c'}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                textContentType={textContentType}
                secureTextEntry={secureTextEntry}
            />
            {!!error && <Error message={error} />}
        </View>
    )
}
