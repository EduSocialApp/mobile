import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useOrganization } from '../../../hooks/organization'
import { Button } from '../../button'
import { headline } from '../../../functions/colors'
import { TextInput } from '../../form'
import { useEffect, useRef, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { apiUsersToInvite, UserToInvite } from '../../../api/user/toInvite'
import { router } from 'expo-router'
import { apiLinkMember } from '../../../api/organization/linkMember'
import { placeholderImage } from '../../../functions/placeholderImage'

export default function OrganizationAddMembers() {
    const org = useOrganization()
    if (!org) return null

    const [members, setMembers] = useState<UserToInvite[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const lastUserId = useRef<string>(undefined)
    const isEndReached = useRef(false)
    const debounceTime = useRef<NodeJS.Timeout>(undefined)

    useEffect(() => {
        lastUserId.current = undefined
        isEndReached.current = false

        if (search.length > 0) {
            handleSearch(1000, []) // 1s se tiver texto, 100ms se não tiver
        } else {
            clearTimeout(debounceTime.current)
            setLoading(false)
            setMembers([])
        }
    }, [search])

    const handleSearch = (waitTime = 1000, loadedItems = members) => {
        if (!search) return
        if (isEndReached.current) return // Se já chegou no final, não busca mais

        setLoading(true)

        clearTimeout(debounceTime.current)
        debounceTime.current = setTimeout(() => fetchSearch(loadedItems), waitTime)
    }

    const fetchSearch = async (loadedItems: UserToInvite[] = []) => {
        const result = await apiUsersToInvite({
            query: search,
            userId: lastUserId.current,
            organizationId: org.organization.id,
        })

        lastUserId.current = result.lastUserId

        if (result.itens.length === 1) {
            isEndReached.current = true
        }

        setMembers([...loadedItems, ...result.itens])
        setLoading(false)
    }

    const MemberCell = ({ item: { biography, displayName, organizations, pictureUrl, id } }: { item: UserToInvite }) => {
        const orgMember = organizations.length > 0 ? organizations[0] : null

        const [invited, setInvited] = useState(orgMember?.invited || false)

        return (
            <View className="p-2 flex-row items-center">
                <TouchableOpacity onPress={() => router.push(`/authenticated/profile/${id}`)} className="flex-row items-center flex-1">
                    <Image source={{ uri: pictureUrl }} placeholder={placeholderImage} className="h-10 w-10 rounded-full" />
                    <View className="flex-1 mx-2">
                        <Text className="font-semibold" style={{ fontSize: 16 }}>
                            {displayName}
                        </Text>
                        {!!biography && (
                            <Text numberOfLines={1} className="text-stone-500">
                                {biography}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
                {invited && <Text className="text-stone-400 ">Convidado</Text>}
                {orgMember && !invited && <Text className="text-stone-400 ">Membro</Text>}
                {!orgMember && !invited && (
                    <Button
                        text="Adicionar"
                        onPress={() => {
                            apiLinkMember(org.organization.id, id).catch(console.log)
                            setInvited(true)
                        }}
                        size="sm"
                        variant="outline"
                    />
                )}
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <View className="p-2 py-4 border-b border-stone-100" style={{ gap: 12 }}>
                {/* <View className="flex-row" style={{ gap: 12 }}>
                    <View className="flex-1">
                        <Button text="Adicionar" onPress={() => {}} variant="outline">
                            <View className="flex-row items-center" style={{ gap: 10 }}>
                                <MaterialCommunityIcons name="link" size={24} color={headline} />
                                <Text>Compartilhar link</Text>
                            </View>
                        </Button>
                    </View>
                    <View className="flex-1">
                        <Button text="Adicionar" onPress={() => {}} variant="outline">
                            <View className="flex-row items-center" style={{ gap: 10 }}>
                                <MaterialCommunityIcons name="qrcode-scan" size={24} color={headline} />
                                <Text>Escanear QRCode</Text>
                            </View>
                        </Button>
                    </View>
                </View> */}
                <TextInput
                    placeholder="Buscar usuário"
                    onChangeText={setSearch}
                    value={search}
                    PrefixChild={<MaterialCommunityIcons name="magnify" size={24} color={headline} />}
                />
            </View>
            <FlashList
                data={members}
                renderItem={({ item }) => <MemberCell item={item} />}
                estimatedItemSize={100}
                contentContainerStyle={{ paddingVertical: 8 }}
                ListEmptyComponent={
                    !loading ? (
                        <Text className="p-4 text-center text-stone-500">
                            {
                                {
                                    empty: 'Nenhum usuário encontrado',
                                    search: 'Busque por um usuário',
                                }[search ? 'empty' : 'search']
                            }
                        </Text>
                    ) : null
                }
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
                onEndReached={() => handleSearch(100)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator color="#a5a5a5" /> : null}
            />
        </View>
    )
}
