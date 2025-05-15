import { View, Text, TouchableOpacity } from 'react-native'
import { apiGetPendingOrganizations, PendingOrganization } from '../../api/user/pendingOrganizations'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Button } from '../button'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { apiMemberAcceptOrganization } from '../../api/organization/memberAccept'
import { apiMemberRejectOrganization } from '../../api/organization/memberReject'
import { VerifiedBadge } from '../verifiedBadge'
import { placeholderImage } from '../../functions/placeholderImage'
import SafeView from '../safeView'

function OrganizationCell({ id, organization: { id: organizationId, displayName, biography, pictureUrl, verified } }: PendingOrganization) {
    const [status, setStatus] = useState<number>(0)

    const handleRequest = (status: boolean) => {
        if (status) {
            setStatus(1) // Aceitando
            return apiMemberAcceptOrganization(id).catch(console.log)
        }

        setStatus(2) // Rejeitando
        apiMemberRejectOrganization(id).catch(console.log)
    }

    return (
        <View key={id} className="my-2 flex-row justify-between items-center">
            <TouchableOpacity className="flex-1" onPress={() => router.push('/authenticated/organization/' + organizationId)}>
                <View className="flex-row items-center">
                    <Image source={{ uri: pictureUrl }} placeholder={placeholderImage} className="h-10 w-10 rounded-lg" />
                    <View className="flex-1 ml-2">
                        <View className="flex-row flex-1 items-center" style={{ gap: 4 }}>
                            <Text className="font-semibold" numberOfLines={1} style={{ fontSize: 16 }}>
                                {displayName}
                            </Text>
                            {verified && <VerifiedBadge type="organization" />}
                        </View>
                        {!!biography && (
                            <Text numberOfLines={1} className="text-stone-500">
                                {biography}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
            {status === 1 && <Text className="text-stone-400">Aceito</Text>}
            {status === 2 && <Text className="text-stone-400">Rejeitado</Text>}
            {status === 0 && (
                <View className="flex-row" style={{ gap: 10 }}>
                    <Button onPress={() => handleRequest(true)} text="Aceitar" size="sm" variant="outline" />
                    <Button onPress={() => handleRequest(false)} variant="link">
                        <MaterialCommunityIcons name="close" size={28} />
                    </Button>
                </View>
            )}
        </View>
    )
}

export function PendingOrganizations() {
    const [pendingOrganizations, setPendingOrganizations] = useState<PendingOrganization[]>([])

    useEffect(() => {
        fetchPendingOrganizations()
    }, [])

    const fetchPendingOrganizations = () => {
        console.log('Carregou organizações pendentes')
        apiGetPendingOrganizations()
            .then(({ data }) => setPendingOrganizations(data?.organizations || []))
            .catch(console.log)
    }

    if (pendingOrganizations.length === 0) return null

    return (
        <SafeView>
            <View>
                <Text className="text-lg font-semibold">Instituições</Text>
                <Text className="text-stone-500">Instituições que te enviaram convite para participar</Text>
            </View>
            <View className="my-3">
                {pendingOrganizations.map((item) => (
                    <OrganizationCell {...item} key={item.id} />
                ))}
            </View>
        </SafeView>
    )
}
