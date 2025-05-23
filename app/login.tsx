import { useState } from 'react'
import { Text, View, Alert } from 'react-native'
import { router } from 'expo-router'

import { TitleBlack, TextInput, Button, PasswordInput } from '../components'
import { apiUserLogin } from '../api'
import { notificationDevice } from '../functions/notification'
import { saveCredentialsInSecureStore } from '../functions/authentication'
import SafeView from '../components/safeView'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<string>()

    const handleLogin = async () => {
        try {
            setLoading('login')

            const { deviceName, notificationToken } = await notificationDevice()
            const requisicao = await apiUserLogin({ email, password, notificationToken, deviceName })
            setLoading(undefined)

            if (requisicao.status === 200) {
                saveCredentialsInSecureStore(requisicao.data.accessToken, requisicao.data.refreshToken, requisicao.data.expirationDate)

                router.replace('/authenticated')
            } else {
                Alert.alert('Erro', 'Usuário ou senha incorretos')
            }
        } catch (e) {
            setLoading(undefined)
            Alert.alert('Erro', 'Usuário ou senha incorretos')
        }
    }

    return (
        <SafeView className="p-2 bg-white" style={{ gap: 24 }}>
            <View className="flex-1 justify-center">
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
                        />

                        <PasswordInput onChangeText={setPassword} value={password} placeholder="Senha" textContentType="password" secureTextEntry />
                    </View>

                    {/* <View className="items-end mt-2">
                        <Button onPress={() => {}} text="Esqueceu sua senha?" variant="link" />
                    </View> */}

                    <View className="mt-6">
                        <Button onPress={handleLogin} text="Entrar" loading={loading === 'login'} />
                    </View>

                    <Button onPress={() => router.push('/createAccount')} variant="link" className="mt-4">
                        <Text>
                            Não tem uma conta? <Text className="font-bold text-primary-200">Criar agora</Text>
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeView>
    )
}
