import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TitleBlack } from '../../components/title'
import { getRegisterCache, saveRegisterCache } from './functions/cache'

import { Permissions } from './types'
import { Button } from '../../components'

interface IPermission {
    id: keyof Permissions
    title: string
    description: string
    link?: string
}

export default function CreateAccountTerms() {
    const [permissions, setPermissions] = useState<Permissions>({
        connectWithNeighbors: true,
        privacyPolicy: true,
        receiveEmails: true,
        receiveNotifications: true,
        termsOfUse: true,
    })

    useEffect(() => {
        getCacheValues()
    }, [])

    const getCacheValues = async () => {
        const user = await getRegisterCache()
        if (!user) return

        setPermissions({ ...user.permissions })
    }

    const setPermissionStatus = (id: keyof Permissions, status: boolean) => {
        permissions[id] = status
        setPermissions({ ...permissions })
    }

    const Permission = ({ id, title, description }: IPermission) => (
        <TouchableOpacity
            onPress={() => setPermissionStatus(id, !permissions[id])}
            className="my-1 flex-row bg-white p-2 rounded-lg border border-stone-200">
            <View
                className="h-full w-2 rounded-full"
                style={{
                    backgroundColor: permissions[id] ? '#16a34a' : '#e11d48',
                }}
            />
            <View className="flex-1 p-2">
                <Text className="font-bold">{title}</Text>
                <Text>{description}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="mt-3">
                <View className="absolute h-full justify-center left-3 z-10">
                    <Button text="voltar" onPress={() => router.back()} variant="link" />
                </View>

                <TitleBlack />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
                <View className="m-1 p-2" style={{ gap: 24 }}>
                    <View>
                        <Text className="text-xl mt-6">Customizar sua experiência</Text>
                        <Text className="mt-2">Recomendamos manter todas as permissões ativadas para aproveitar ao máximo o aplicativo</Text>
                    </View>

                    <View style={{ gap: 4 }}>
                        <Permission id="receiveEmails" title="Receber emails" description="Enviaremos emails de ajuda, notícias e avisos" />
                        <Permission
                            id="connectWithNeighbors"
                            title="Conectar com conhecidos"
                            description="Buscaremos em sua agenda telefonica colegas que já estão cadastrados no EduSocial"
                        />
                        <Permission
                            id="receiveNotifications"
                            title="Receber notificações"
                            description="Enviaremos notificações de notícias, avisos e novidades"
                        />
                        <Permission
                            id="termsOfUse"
                            title="Termos de uso"
                            link="#"
                            description="Enviaremos notificações de notícias, avisos e novidades"
                        />
                        <Permission
                            id="privacyPolicy"
                            title="Política de privacidade"
                            link="#"
                            description="Enviaremos notificações de notícias, avisos e novidades"
                        />
                    </View>
                </View>
            </ScrollView>
            <View className="p-2">
                <Button
                    onPress={async () => {
                        const user = await getRegisterCache()
                        if (!user) return

                        if (!permissions.termsOfUse) {
                            Alert.alert('Termos de uso', 'Você precisa aceitar os termos de uso para continuar')
                            return
                        }

                        if (!permissions.privacyPolicy) {
                            Alert.alert('Política de privacidade', 'Você precisa aceitar a política de privacidade para continuar')
                            return
                        }

                        saveRegisterCache({ ...user, permissions })

                        router.push('/createAccount/password')
                    }}
                    text="Confirmar conta"
                />
            </View>
        </SafeAreaView>
    )
}
