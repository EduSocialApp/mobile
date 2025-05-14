import { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { apiUserOrganizations, UserOrganization } from '../../../api/organization/userOrganizations'
import { router, useFocusEffect } from 'expo-router'
import debounce from 'lodash/debounce'
import { useUser } from '../../../hooks/user'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { Button } from '../../button'
import { VerifiedBadge } from '../../verifiedBadge'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { placeholderImage } from '../../../functions/placeholderImage'
import { useHeaderOptions } from '../../../hooks/headerOptions'
import { ItemSeparator } from '../../itemSeparator'

export function ProfileOrganizations() {
    const { setHeaderHeight } = useHeaderOptions()

    const userLogged = useUserAuthenticated()
    const userHook = useUser()
    if (!userHook) return null

    const {
        user: { id },
        myProfile,
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

    const Header = () => <>{userLogged.isAdmin && myProfile && ModeratorActions}</>

    const OrganizationRender = ({
        item: {
            organization: { id, displayName, pictureUrl, verified, biography },
        },
    }: {
        item: UserOrganization
    }) => {
        return (
            <TouchableOpacity key={id} onPress={() => router.push('/authenticated/organization/' + id)} className="py-2">
                <View className="flex-row items-center">
                    <Image placeholder={placeholderImage} source={{ uri: pictureUrl }} className="h-10 w-10 rounded-lg" />
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
                contentContainerStyle={{ padding: 10 }}
                estimatedItemSize={100}
                refreshing={loading === 'loading'}
                onRefresh={handleOrganizations}
                ItemSeparatorComponent={() => <ItemSeparator />}
                onScroll={({
                    nativeEvent: {
                        contentOffset: { y },
                    },
                }) => {
                    setHeaderHeight(y - 150)
                }}
                scrollEventThrottle={16}
            />
        </View>
    )
}
