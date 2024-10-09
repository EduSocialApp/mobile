import { View, Text, TouchableOpacity } from 'react-native'
import { Header } from '../../../../../components/header'
import { useEffect, useState } from 'react'
import { apiWaitingAnalysis, OrganizationWaitingAnalysis } from '../../../../../api/organization/waitingAnalysis'
import debounce from 'lodash/debounce'
import { FlashList } from '@shopify/flash-list'
import { maskCnpj } from '../../../../../functions/masks'
import { Image } from 'expo-image'
import { router } from 'expo-router'

function OrganizationCell({ item: { id, displayName, document, pictureUrl } }: { item: OrganizationWaitingAnalysis }) {
    return (
        <TouchableOpacity
            onPress={() => router.push('/authenticated/organization/' + id)}
            className="flex-row p-2 mb-2 items-center bg-white border rounded-md border-stone-200"
            style={{ gap: 8 }}>
            <Image source={{ uri: pictureUrl }} className="h-12 w-12 rounded-md" />
            <View className="flex-1" style={{ gap: 2 }}>
                <Text className="font-bold">{displayName}</Text>
                <Text className="text-stone-500">{maskCnpj(document)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default function AnalyseOrganizations() {
    const [loading, setLoading] = useState<string | undefined>('organizations')
    const [organizations, setOrganizations] = useState<OrganizationWaitingAnalysis[]>([])

    useEffect(() => {
        handleOrganizations()
    }, [])

    const handleOrganizations = () => {
        setLoading('organizations')
        debounce(fetchOrganizations, 100)()
    }

    const fetchOrganizations = async () => {
        setLoading('organizations')
        try {
            const { data } = await apiWaitingAnalysis()
            setOrganizations(data)
        } catch (error) {
            setOrganizations([])
        } finally {
            setLoading(undefined)
        }
    }

    return (
        <View className="flex-1 bg-stone-50">
            <Header title="Instituições pendentes" backButton />

            <FlashList
                renderItem={({ item }) => {
                    return <OrganizationCell item={item} />
                }}
                contentContainerStyle={{ padding: 10, paddingVertical: 20 }}
                estimatedItemSize={50}
                data={organizations}
                refreshing={loading === 'organizations'}
                onRefresh={handleOrganizations}
            />
        </View>
    )
}
