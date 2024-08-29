import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TitleBlack } from '../../components/title'
import { getRegisterCache, saveRegisterCache } from './functions/cache'

import { IPermissions } from './types'

interface IPermission {
    id: keyof IPermissions
    title: string
    description: string
    link?: string
}

export default function CreateAccountTerms() {
    const [permissions, setPermissions] = useState<IPermissions>({
        connectWithNeighbors: true,
        privacyPolicy: true,
        receiveEmails: true,
        receiveNotifications: true,
        termsOfUse: true
    })

    useEffect(() => {
        getCacheValues()
    }, [])

    const getCacheValues = async () => {
        const user = await getRegisterCache()
        if (!user) return

        setPermissions({ ...user.permissions })
    }

    const setPermissionStatus = (id: keyof IPermissions, status: boolean) => {
        permissions[id] = status
        setPermissions({ ...permissions })
    }

    const Permission = ({ id, title, description }: IPermission) => (
        <TouchableOpacity
            onPress={() => setPermissionStatus(id, !permissions[id])}
            style={{ marginVertical: 4, flexDirection: 'row', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', padding: 8, borderRadius: 6 }}
        >
            <View style={{ height: '100%', width: 8, backgroundColor: permissions[id] ? '#16a34a' : '#e11d48', borderRadius: 999 }} />
            <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={{ fontWeight: '600' }}>{title}</Text>
                <Text>{description}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <View style={{ marginTop: 10 }}>
                <View style={{ position: 'absolute', height: '100%', justifyContent: 'center', left: 12 }}>
                    <TouchableOpacity style={{ zIndex: 10 }} onPress={() => router.back()}>
                        <Text>voltar</Text>
                    </TouchableOpacity>
                </View>

                <TitleBlack />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
                <View style={{ margin: 4, padding: 8 }}>
                    <Text style={{ fontSize: 24, marginTop: 24 }}>Customizar sua experiência</Text>
                    <Text style={{ marginTop: 4 }}>Recomendamos manter todas as permissões ativadas para aproveitar ao máximo o aplicativo</Text>

                    <View style={{ marginTop: 24 }}>
                        <Permission
                            id='receiveEmails'
                            title='Receber emails'
                            description='Enviaremos emails de ajuda, notícias e avisos'
                        />
                        <Permission
                            id='connectWithNeighbors'
                            title='Conectar com conhecidos'
                            description='Buscaremos em sua agenda telefonica colegas que já estão cadastrados no EduSocial'
                        />
                        <Permission
                            id='receiveNotifications'
                            title='Receber notificações'
                            description='Enviaremos notificações de notícias, avisos e novidades'
                        />
                        <Permission
                            id='termsOfUse'
                            title='Termos de uso'
                            link='#'
                            description='Enviaremos notificações de notícias, avisos e novidades'
                        />
                        <Permission
                            id='privacyPolicy'
                            title='Política de privacidade'
                            link='#'
                            description='Enviaremos notificações de notícias, avisos e novidades'
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={{ padding: 8, borderTopWidth: 1, borderColor: '#e2e8f0' }}>
                <TouchableOpacity onPress={async () => {
                    const user = await getRegisterCache()
                    if (!user) return

                    saveRegisterCache({ ...user, permissions })

                    router.push('/createAccount/password')
                }} style={{ backgroundColor: '#2563eb', padding: 16, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' }}>
                    <Text style={{ color: '#ffffff' }}>Confirmar conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}