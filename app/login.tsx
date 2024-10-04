import { useState } from 'react'
import { Text, View, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { saveSession } from '../functions/session'

import { TitleBlack, TextInput, Button, PasswordInput } from '../components'
import { apiUserLogin } from '../api'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<string>()

    const handleLogin = async () => {
        try {
            setLoading('login')
            const requisicao = await apiUserLogin({ email, password })
            setLoading(undefined)

            if (requisicao.status === 200) {
                saveSession(requisicao.data.accessToken, requisicao.data.refreshToken)

                router.replace('authenticated')
            } else {
                Alert.alert('Erro', 'Usuário ou senha incorretos')
            }
        } catch {
            setLoading(undefined)
            Alert.alert('Erro', 'Usuário ou senha incorretos')
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-center p-2 bg-background" style={{ gap: 24 }}>
            <View className="my-2">
                <TitleBlack />
                <Text className="text-center">Aprendizado conectado e compartilhado</Text>
            </View>

            <View className="m-3">
                <View style={{ gap: 24 }}>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Digite seu e-mail"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />

                    <PasswordInput onChangeText={setPassword} value={password} placeholder="Senha" textContentType="password" secureTextEntry />
                </View>

                <View className="items-end mt-2">
                    <Button onPress={() => {}} text="Esqueceu sua senha?" variant="link" />
                </View>

                <View className="mt-6">
                    <Button onPress={handleLogin} text="Entrar" loading={loading === 'login'} />
                </View>

                <Button onPress={() => router.push('/createAccount')} variant="link" className="mt-4">
                    <Text>
                        Não tem uma conta? <Text className="font-bold text-primary-200">Criar agora</Text>
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}
