import { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { apiUserOrganizations, UserOrganization } from '../../../api/organization/userOrganizations'
import { router, useFocusEffect } from 'expo-router'
import debounce from 'lodash/debounce'
import { useUser } from '../../../hooks/user'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Button } from '../../button'
import { VerifiedBadge } from '../../verifiedBadge'

const ButtonCreateOrganization = (
    <View className="bg-stone-100 p-2 mb-4 items-center rounded-md flex-row" style={{ gap: 12 }}>
        <View className="flex-1 relative" style={{ gap: 2 }}>
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
)

export function ProfileOrganizations() {
    const userHook = useUser()
    if (!userHook) return null

    const {
        user: { id },
        myProfile,
        isModerator,
    } = userHook

    const [loading, setLoading] = useState<string>()
    const [organizations, setOrganizations] = useState<UserOrganization[]>([])

    // Executa a função fetchOrganizations sempre que a tela é focada
    useFocusEffect(
        useCallback(() => {
            handleOrganizations()

            return () => {}
        }, [])
    )

    const handleOrganizations = () => {
        setLoading('loading')
        debounce(fetchOrganizations, 100)()
    }

    const fetchOrganizations = async () => {
        setLoading('loading')
        try {
            const { data } = await apiUserOrganizations(id)
            setOrganizations(data)
        } catch (error) {
            setOrganizations([])
        } finally {
            setLoading(undefined)
        }
    }

    const ModeratorActions = (
        <ScrollView horizontal className="pb-4 mb-4 border-b border-stone-100" contentContainerStyle={{ gap: 10, flexDirection: 'row' }}>
            <Button onPress={() => router.push(`/authenticated/profile/adm/analyseOrganizations`)} text="Analisar instituições" variant="ghost" />
        </ScrollView>
    )

    const Header = () => (
        <>
            {isModerator && ModeratorActions}
            {myProfile && ButtonCreateOrganization}
        </>
    )

    const OrganizationRender = ({
        item: {
            organization: { id, displayName, pictureUrl, verified, biography },
        },
    }: {
        item: UserOrganization
    }) => {
        return (
            <TouchableOpacity key={id} onPress={() => router.push('/authenticated/organization/' + id)}>
                <View className="flex-row items-center">
                    <Image source={{ uri: pictureUrl }} className="h-10 w-10 rounded-lg" />
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
        )
    }

    return (
        <View className="flex-1 bg-white">
            <FlashList
                data={organizations}
                ListHeaderComponent={Header}
                renderItem={OrganizationRender}
                contentContainerStyle={{ paddingVertical: 20 }}
                estimatedItemSize={100}
                refreshing={loading === 'loading'}
                onRefresh={handleOrganizations}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
            />
        </View>
    )
}
