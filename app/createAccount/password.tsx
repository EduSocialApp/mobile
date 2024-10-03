import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { destroyRegisterCache, getRegisterCache } from './functions/cache'
import { TitleBlack, Button, PasswordInput } from '../../components'
import { apiUserRegister } from '../../api/user/register'
import { AxiosError } from 'axios'
import { translateMessage } from '../../translate/translateMessage'

export default function CreateAccount() {
    const [password, setPassword] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const [loading, setLoading] = useState<string>()

    useEffect(() => {
        getCacheValues()
    }, [])

    const getCacheValues = async () => {
        const user = await getRegisterCache()
        if (!user) return

        setUserName(user.displayName)
    }

    const handleRegister = async () => {
        setLoading('register')

        const user = await getRegisterCache()
        if (!user) return

        try {
            const requisicao = await apiUserRegister({ ...user, password })
            setLoading(undefined)

            if (requisicao.status === 201) {
                router.replace('login')
                destroyRegisterCache()
            } else {
                Alert.alert('Erro', 'Erro ao cadastrar usuário')
            }
        } catch (e) {
            setLoading(undefined)
            if (e instanceof AxiosError) {
                Alert.alert('Erro', translateMessage(e.response?.data?.message))
                return
            }
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="mt-3">
                <View className="absolute h-full justify-center left-3 z-10">
                    <Button text="voltar" onPress={() => router.back()} variant="link" />
                </View>
                <TitleBlack />
            </View>

            <View className="m-1 p-2 flex-1" style={{ gap: 24 }}>
                <View>
                    <Text className="text-xl mt-6">Definir sua senha</Text>
                    <Text className="mt-2">{userName}, chegamos à última etapa do seu cadastro. Agora, basta escolher uma senha. Capriche!</Text>
                </View>

                <View style={{ gap: 18 }}>
                    <PasswordInput
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Min. 8 caracteres"
                        textContentType="password"
                        secureTextEntry
                    />
                </View>
            </View>

            <View className="p-2">
                <Button text="Completar cadastro" onPress={handleRegister} variant="primary" loading={loading === 'register'} />
            </View>
        </SafeAreaView>
    )
}
