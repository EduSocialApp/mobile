import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { apiOrganizationMembers, OrganizationMember } from '../../../api/organization/members'
import { useOrganization } from '../../../hooks/organization'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { Button } from '../../button'
import { useUserAuthenticated } from '../../../hooks/authenticated'

function MemberCell({
    item: {
        user: { id, name, pictureUrl },
    },
}: {
    item: OrganizationMember
}) {
    return (
        <TouchableOpacity className="p-2" onPress={() => router.push('/authenticated/profile/' + id)}>
            <View className="flex-row items-center">
                <Image source={{ uri: pictureUrl }} className="h-10 w-10 rounded-full" />
                <View className="flex-1 ml-2">
                    <Text className="font-semibold" style={{ fontSize: 16 }}>
                        {name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export function OrganizationMembers() {
    const user = useUserAuthenticated()?.user
    const org = useOrganization()
    if (!org || !user) return null

    const [members, setMembers] = useState<OrganizationMember[]>([])
    const [loading, setLoading] = useState(true)

    const lastOrgMemberId = useRef<string>()
    const isEndReached = useRef(false)
    const debounceTime = useRef<NodeJS.Timeout>()

    useEffect(() => {
        resetRequest()
    }, [])

    const resetRequest = () => {
        lastOrgMemberId.current = undefined
        isEndReached.current = false

        handleRequest(100, [])
    }

    const handleRequest = (waitTime = 1000, loadedItems = members) => {
        if (isEndReached.current) return // Se já chegou no final, não busca mais

        setLoading(true)

        clearTimeout(debounceTime.current)
        debounceTime.current = setTimeout(() => fetchMembers(loadedItems), waitTime)
    }

    const fetchMembers = async (loadedItems: OrganizationMember[] = []) => {
        const result = await apiOrganizationMembers(org.organization.id)

        lastOrgMemberId.current = result.lastOrganizationMemberId

        if (result.itens.length === 1) {
            isEndReached.current = true
        }

        setMembers([...loadedItems, ...result.itens])
        setLoading(false)
    }

    const viewHeader = user?.role === 'ADMIN' || user?.role === 'MODERATOR' || org.userLoggedRole === 'OWNER' || org.userLoggedRole === 'MODERATOR'
    const viewAddMember = viewHeader

    const id = org.organization.id

    const Header = (
        <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10 }}>
            {viewAddMember && (
                <Button
                    onPress={() => router.push(`/authenticated/organization/adm/${id}/manageMembers`)}
                    text="Gerenciar membros"
                    variant="outline"
                />
            )}
        </ScrollView>
    )

    return (
        <View className="flex-1 bg-white">
            <FlashList
                data={members}
                renderItem={MemberCell}
                ListHeaderComponent={viewHeader ? Header : null}
                estimatedItemSize={100}
                contentContainerStyle={{ paddingVertical: 10 }}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
                onEndReached={() => handleRequest(100)}
                onEndReachedThreshold={0.5}
                onRefresh={resetRequest}
                refreshing={loading}
                // ListFooterComponent={loading ? <ActivityIndicator color="#a5a5a5" /> : null}
            />
        </View>
    )
}
