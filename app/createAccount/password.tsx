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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <View style={{ marginTop: 10 }}>
                <TitleBlack />
            </View>
            <View style={{ margin: 4, padding: 8, flex: 1 }}>
                <Text style={{ fontSize: 24, marginTop: 18 }}>Definir sua senha</Text>
                <Text style={{ marginTop: 4 }}>{userName}, chegamos à última etapa do seu cadastro. Agora, basta escolher uma senha. Capriche!</Text>

                <View style={{ marginTop: 12 }}>
                    <Text>Senha</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderRadius: 6, borderColor: '#475569', padding: 12, marginTop: 4 }}
                        onChangeText={setPassword}
                        value={password}
                        placeholder='Min. 8 caracteres'
                        textContentType='password'
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={{ padding: 8, borderTopWidth: 1, borderColor: '#e2e8f0' }}>
                <TouchableOpacity onPress={async () => {

                    // </View>router.push('/createAccount/password')
                }} style={{ backgroundColor: '#16a34a', padding: 16, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' }}>
                    <Text style={{ color: '#ffffff' }}>Completar cadastro</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}