import { SafeAreaView, KeyboardAvoidingView, Platform, ViewProps } from 'react-native'
import { ReactNode } from 'react'

interface ScreenContainerProps extends ViewProps {
    children: ReactNode
    keyboardBehaviorIOS?: 'padding' | 'height' | 'position'
}

export default function SafeView({ children, keyboardBehaviorIOS = 'padding', style, ...rest }: ScreenContainerProps) {
    return (
        <SafeAreaView style={[{ flex: 1 }, style]} {...rest}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? keyboardBehaviorIOS : undefined} keyboardVerticalOffset={0}>
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
