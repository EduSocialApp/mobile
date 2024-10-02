import { Text, View, ScrollView, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { apiMyOrganizations, MyOrganization } from '../../../api/organization/myOrganizations'
import debounce from 'lodash/debounce'
import { Badge } from '../../../components/badge'

function RenderOrganization({ organization: { id, name, pictureUrl, verified, rejectedVerificationMessage }, role }: MyOrganization) {
    if (role === 'OWNER') {
        return (
            <View key={id} className="p-2 rounded-md" style={{ gap: 8 }}>
                <View className="flex-row" style={{ gap: 8 }}>
                    <Image source={pictureUrl} className="h-10 w-10 rounded-md" />
                    <View className="flex-1">
                        <Text className="font-semibold">{name}</Text>
                        <Text className="text-stone-500">9000 membros</Text>
                    </View>
                </View>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                    <Badge title="Administrador" />
                    {!verified && !rejectedVerificationMessage && <Badge title="Em análise" variant="inactive" />}
                    {rejectedVerificationMessage && <Badge title="Rejeitado" variant="danger" />}
                </View>
            </View>
        )
    }

    return (
        <View key={id}>
            <Text>{name}</Text>
        </View>
    )
}

export default function Organizations() {
    const [loading, setLoading] = useState<string>()
    const [organizations, setOrganizations] = useState<MyOrganization[]>([])

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
        <View className="flex-1 bg-white">
            <Header title="Instituições" />
            <ScrollView
                contentContainerStyle={{ gap: 18, padding: 16 }}
                refreshControl={<RefreshControl refreshing={loading === 'loading'} onRefresh={handleOrganizations} />}>
                <View>
                    <Text className="text-lg font-bold">Minhas intituições</Text>
                    <Text>Todas as instituições com as quais estou conectado, em um só lugar</Text>
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

                <View>{organizations.map(RenderOrganization)}</View>
            </ScrollView>
        </View>
    )
}
