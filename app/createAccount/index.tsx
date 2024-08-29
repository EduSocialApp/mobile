import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { TitleBlack } from '../../components/title'

import { getRegisterCache, saveRegisterCache } from './functions/cache'
import { ScrollView } from 'react-native-gesture-handler'

export default function CreateAccount() {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [birthdayDate, setBirthdayDate] = useState<Date>()
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false)
    const [showErrors, setShowErrors] = useState(false)

    useEffect(() => {
        getCacheValues()
    }, [])

    const getCacheValues = async () => {
        const user = await getRegisterCache()
        if (user) {
            setName(user.fullname)
            setEmail(user.email)
            setBirthdayDate(new Date(user.date))
        }
    }

    const Error = ({ message }: { message: string }) => {
        if (!showErrors) return (<></>)

        return (
            <Text style={{ marginTop: 4, color: '#f43f5e' }}>(*) {message}</Text>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <View style={{ marginTop: 10 }}>
                <View style={{ position: 'absolute', height: '100%', justifyContent: 'center', left: 12 }}>
                    <TouchableOpacity style={{ zIndex: 10 }} onPress={() => router.back()}>
                        <Text>cancelar</Text>
                    </TouchableOpacity>
                </View>

                <TitleBlack />
            </View>
            
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
                <View style={{ margin: 4, padding: 8 }}>
                <Text style={{ fontSize: 24, marginTop: 24 }}>Criar conta</Text>
                    <Text style={{ marginTop: 4 }}>Olá! Ficamos felizes com seu interesse no aplicativo. Antes de começar, precisamos de algumas informações</Text>

                    <View style={{ marginTop: 24 }}>
                        <Text>Nome completo</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 6, borderColor: '#475569', padding: 12, marginTop: 4 }}
                            onChangeText={setName}
                            value={name}
                            placeholder='Seu nome completo'
                            autoCapitalize='words'
                            textContentType='name'
                        />
                        {!name && <Error message='Informar o seu nome completo é importante para gente te conhecer melhor' />}
                    </View>

                    <View style={{ marginVertical: 16 }}>
                        <Text>Email</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 6, borderColor: '#475569', padding: 12, marginTop: 4 }}
                            onChangeText={setEmail}
                            value={email}
                            placeholder='Ex: contato@edusocial.com.br'
                            autoCapitalize='none'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                        />
                        {!email && <Error message='Precisamos do seu email para termos nosso primeiro contato' />}
                    </View>

                    <View>
                        <Text>Data de nascimento</Text>
                        <TouchableOpacity
                            style={{ borderWidth: 1, borderRadius: 6, borderColor: '#475569', padding: 12, marginTop: 4 }}
                            onPress={() => setDatePickerVisibility(true)}
                        >
                            <Text>{birthdayDate ? birthdayDate.toLocaleDateString('pt-BR') : <Text style={{ color: '#9ca3af' }}>Sua data de aniversário</Text>}</Text>
                        </TouchableOpacity>
                        {!birthdayDate && <Error message='Precisamos saber sua idade para adequar a melhor experiência a você' />}
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode='date'
                            date={birthdayDate}
                            onConfirm={(date) => {
                                setBirthdayDate(date)
                                setDatePickerVisibility(false)
                            }}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onCancel={() => setDatePickerVisibility(false)}
                            locale='pt-BR'
                            cancelTextIOS='Fechar'
                            confirmTextIOS='Confirmar'
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={{ padding: 8, borderTopWidth: 1, borderColor: '#e2e8f0' }}>
                <TouchableOpacity onPress={() => {
                    if (!name || !email || !birthdayDate) {
                        return setShowErrors(true)
                    }

                    saveRegisterCache({
                        fullname: name,
                        email: email,
                        date: birthdayDate,
                        confirmationCode: '',
                        password: '',
                        permissions: {
                            receiveEmails: true,
                            connectWithNeighbors: true,
                            receiveNotifications: true,
                            termsOfUse: true,
                            privacyPolicy: true
                        }
                    })

                    router.push('/createAccount/terms')
                }} style={{ backgroundColor: '#2563eb', padding: 16, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' }}>
                    <Text style={{ color: '#ffffff' }}>Próxima etapa</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}