import { KeyboardAvoidingView, Platform, ViewProps, View } from 'react-native'
import { Edges, SafeAreaView } from 'react-native-safe-area-context'
import { ReactNode } from 'react'

interface ScreenContainerProps extends ViewProps {
    children: ReactNode
    keyboardBehaviorIOS?: 'padding' | 'height' | 'position'
    edges?: Edges
}

export default function SafeView({ children, keyboardBehaviorIOS = 'padding', style, edges, ...rest }: ScreenContainerProps) {
    return (
        <SafeAreaView style={[{ flex: 1, paddingTop: Platform.OS === 'android' ? 10 : 0 }, style]} edges={edges} {...rest}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? keyboardBehaviorIOS : undefined} keyboardVerticalOffset={0}>
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
