import { useRef, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { apiAxios } from '../functions/api'

import Message, { IMessageRef, MessageStatus } from '../components/message'

import { destroySession, saveSession } from '../functions/session'

import { TitleBlack, TextInput, Button } from '../components'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [messageVisible, setMessageVisible] = useState<boolean>(false)

    const message = useRef<IMessageRef>(null)

    const login = () => {
        apiAxios
            .post('/user/authenticate', { email, password })
            .then(({ data: { message, accessToken, refreshToken } }) => {
                if (message) {
                    return userIncorrect()
                }

                saveSession(accessToken, refreshToken)
            })
            .catch((err) => {
                userIncorrect()
            })
    }

    const userIncorrect = () => {
        destroySession()
        message.current?.updateMessage('Usuário ou senha incorretos', MessageStatus.Error)
    }

    return (
        <SafeAreaView className="flex-1 justify-center p-2 bg-background">
            <Message ref={message} isVisible={messageVisible} onClose={() => setMessageVisible(false)} onVisible={() => setMessageVisible(true)} />

            <View className="my-2">
                <TitleBlack />
                <Text className="text-center">Criar slogan</Text>
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

                    <TextInput onChangeText={setPassword} value={password} placeholder="Senha" textContentType="password" secureTextEntry />
                </View>

                <TouchableOpacity>
                    <Text className="text-primary text-right mt-2">Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <View className="mt-6">
                    <Button onPress={login} text="Entrar" />
                </View>

                <TouchableOpacity className="items-center justify-center mt-2" onPress={() => router.push('/createAccount')}>
                    <Text>
                        Não tem uma conta? <Text className="font-bold text-primary-200">Criar agora</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}