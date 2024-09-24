import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { TextInput, TitleBlack, DateInput, Button } from '../../components'

import { getRegisterCache, saveRegisterCache } from './functions/cache'

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
        if (!showErrors) return <></>

        return <Text className="mt-2 text-accent-200">{message}</Text>
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="mt-3">
                <View className="absolute h-full justify-center left-3">
                    <TouchableOpacity className="z-10" onPress={() => router.back()}>
                        <Text>cancelar</Text>
                    </TouchableOpacity>
                </View>

                <TitleBlack />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
                <View className="m-1 p-2" style={{ gap: 24 }}>
                    <View>
                        <Text className="text-xl mt-6">Criar conta</Text>
                        <Text className="mt-2">
                            Olá! Ficamos felizes com seu interesse no aplicativo. Antes de começar, precisamos de algumas informações
                        </Text>
                    </View>

                    <View style={{ gap: 18 }}>
                        <TextInput
                            onChangeText={setName}
                            value={name}
                            placeholder="Seu nome completo"
                            autoCapitalize="words"
                            textContentType="name"
                            // error="Informar o seu nome completo é importante para gente te conhecer melhor"
                        />

                        <TextInput
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Seu e-mail principal"
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            // error="Precisamos do seu email para termos nosso primeiro contato"
                        />

                        <DateInput
                            onChange={setBirthdayDate}
                            value={birthdayDate}
                            // error="Precisamos saber sua idade para adequar a melhor experiência a você"
                        />
                    </View>
                </View>
            </ScrollView>

            <View className="p-2">
                <Button
                    text="Próxima etapa"
                    onPress={() => {
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
                                privacyPolicy: true,
                            },
                        })

                        router.push('/createAccount/terms')
                    }}
                />
            </View>
        </SafeAreaView>
    )
}
