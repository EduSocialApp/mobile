import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { getRegisterCache } from './functions/cache'
import { TitleBlack } from '../../components/title'

export default function CreateAccount() {
    const [password, setPassword] = useState<string>('')
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        getCacheValues()
    }, [])

    const getCacheValues = async () => {
        const user = await getRegisterCache()
        if (!user) return

        setUserName(user.fullname.split(' ')[0])
    }


    return (
        <SafeAreaView className='flex-1 bg-background'>
            <View className='mt-3'>
                <TitleBlack />
            </View>

            <View className='m-1 p-2 flex-1' style={{ gap: 24 }}>
                <View>
                    <Text className='text-xl mt-6'>Definir sua senha</Text>
                    <Text className='mt-2'>{userName}, chegamos à última etapa do seu cadastro. Agora, basta escolher uma senha. Capriche!</Text>
                </View>

                <View style={{ gap: 18 }}>
                    <TextInput
                        className='bg-primary-300/30 p-3 px-6 rounded-lg'
                        onChangeText={setPassword}
                        value={password}
                        placeholder='Min. 8 caracteres'
                        textContentType='password'
                        secureTextEntry
                    />
                </View>
            </View>

            <View className='p-2'>
                <TouchableOpacity onPress={async () => {
                }} className='bg-green-700 p-4 px-6 rounded-lg items-center'>
                    <Text className='text-white'>Completar cadastro</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}