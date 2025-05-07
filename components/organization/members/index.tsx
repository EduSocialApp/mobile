import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { apiOrganizationMembers, OrganizationMember } from '../../../api/organization/members'
import { useOrganization } from '../../../hooks/organization'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { Button } from '../../button'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { MemberOptions } from '../modals/MemberOptions'
import { orgOwner, userVerification } from '../../../functions/colors'
import { placeholderImage } from '../../../functions/placeholderImage'

export function OrganizationMembers() {
    const user = useUserAuthenticated()
    const org = useOrganization()
    if (!org) return null

    const [members, setMembers] = useState<OrganizationMember[]>([])
    const [memberSelected, setMemberSelected] = useState<OrganizationMember>()
    const [loading, setLoading] = useState(true)

    const lastOrgMemberId = useRef<string>(undefined)
    const isEndReached = useRef(false)
    const debounceTime = useRef<NodeJS.Timeout>(undefined)

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
        const result = await apiOrganizationMembers(org.organization.id, lastOrgMemberId.current)

        lastOrgMemberId.current = result.lastOrganizationMemberId

        if (result.itens.length === 0) {
            isEndReached.current = true
        }

        setMembers([...loadedItems, ...result.itens])
        setLoading(false)
    }

    const id = org.organization.id

    const Header = (
        <ScrollView horizontal className="pt-2 pb-4 mb-2 border-b border-stone-100">
            <View className="flex-row flex-1" style={{ gap: 10 }}>
                {(org.isMemberModerator || user.isModerator) && (
                    <Button
                        onPress={() => router.push(`/authenticated/organization/adm/${id}/manageMembers`)}
                        text="Gerenciar membros"
                        variant="ghost"
                    />
                )}
            </View>
        </ScrollView>
    )

    const MemberCell = ({ item }: { item: OrganizationMember }) => {
        const {
            user: { id, name, pictureUrl, displayName },
            role,
        } = item

        return (
            <TouchableOpacity className="p-2" onPress={() => router.push('/authenticated/profile/' + id)}>
                <View className="flex-row items-center">
                    <Image source={{ uri: pictureUrl }} placeholder={placeholderImage} className="h-10 w-10 rounded-full" />
                    <View className="flex-1 flex-row items-center ml-2" style={{ gap: 4 }}>
                        <Text className="font-semibold" style={{ fontSize: 16 }}>
                            {displayName}
                        </Text>
                        {role === 'OWNER' && <MaterialCommunityIcons name="shield" size={16} color={userVerification} />}
                        {role === 'MODERATOR' && <MaterialCommunityIcons name="shield-outline" size={16} color={userVerification} />}
                    </View>
                    {org.isMemberModerator && (
                        <Button onPress={() => setMemberSelected(item)} variant="link">
                            <View className="p-2">
                                <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                            </View>
                        </Button>
                    )}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <MemberOptions member={memberSelected} close={() => setMemberSelected(undefined)} onConfirmEvent={() => {}} />
            <FlashList
                data={members}
                renderItem={MemberCell}
                ListHeaderComponent={org.isMemberModerator || user.isModerator ? Header : null}
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
