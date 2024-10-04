import { Text, View, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native'
import { Image } from 'expo-image'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { apiMyOrganizations, MyOrganization } from '../../../api/organization/myOrganizations'
import debounce from 'lodash/debounce'
import { Badge } from '../../../components/badge'
import { ModalUserQrCode } from '../../../components/modals/userQrcode'

function RenderOrganization({ organization: { id, displayName, pictureUrl, verified, biography }, role }: MyOrganization) {
    return (
        <TouchableOpacity key={id} onPress={() => router.push('/authenticated/organization/' + id)}>
            <View className="flex-row items-center">
                <Image source={{ uri: pictureUrl }} className="h-10 w-10 rounded-lg" />
                <View className="flex-1 ml-2">
                    <View className="flex-row flex-1 items-center" style={{ gap: 4 }}>
                        <Text className="font-semibold" numberOfLines={1} style={{ fontSize: 16 }}>
                            {displayName}
                        </Text>
                        {verified && <MaterialCommunityIcons name="check-decagram" size={20} color="#2d334a" />}
                    </View>
                    {!!biography && (
                        <Text numberOfLines={1} className="text-stone-500">
                            {biography}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function Organizations() {
    const [loading, setLoading] = useState<string>()
    const [organizations, setOrganizations] = useState<MyOrganization[]>([])
    const [openUserLinkShareable, setOpenUserLinkShareable] = useState<boolean>(false)

    // Executa a função fetchOrganizations sempre que a tela é focada
    useFocusEffect(
        useCallback(() => {
            handleOrganizations()

            return () => {}
        }, [])
    )

    const handleOrganizations = () => {
        setLoading('loading')
        debounce(fetchOrganizations, 1000)()
    }

    const fetchOrganizations = async () => {
        setLoading('loading')
        try {
            const { data } = await apiMyOrganizations()
            setOrganizations(data)
        } catch (error) {
            setOrganizations([])
        } finally {
            setLoading(undefined)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ModalUserQrCode onClose={() => setOpenUserLinkShareable(false)} visible={openUserLinkShareable} />
            <ScrollView
                contentContainerStyle={{ gap: 18, padding: 8 }}
                refreshControl={<RefreshControl refreshing={loading === 'loading'} onRefresh={handleOrganizations} />}>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                    <View className="flex-1">
                        <Text className="text-lg font-bold">Instituições conectadas</Text>
                        <Text>Todas as instituições com as quais você está conectado, em um só lugar</Text>
                    </View>
                    <Button onPress={() => setOpenUserLinkShareable(true)} variant="link">
                        <MaterialCommunityIcons name="qrcode" size={42} color="#272343" />
                    </Button>
                </View>

                <View className="bg-stone-100 p-4 items-center rounded-md flex-row" style={{ gap: 12 }}>
                    <View className="flex-1" style={{ gap: 2 }}>
                        <Text className="font-semibold text-stone-700">Responsável por uma instituição?</Text>
                        <Text className="text-stone-600">Junte-se ao EduSocial e crie uma comunidade conectada</Text>
                    </View>
                    <Button
                        onPress={() => {
                            router.push('/authenticated/organization/create')
                        }}
                        variant="primary">
                        <View className="p-5">
                            <MaterialCommunityIcons name="web-plus" size={24} color="#272343" />
                        </View>
                    </Button>
                </View>

                <View style={{ gap: 18 }}>{organizations.map(RenderOrganization)}</View>
            </ScrollView>
        </SafeAreaView>
    )
}
