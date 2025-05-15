import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ContactList } from '../../../components/messages/contactList'
import { router, useFocusEffect } from 'expo-router'
import { saveCache } from '../../../cache/asyncStorage'
import { apiGetUserConversations } from '../../../api/conversation/getUserConversations'
import { FlashList } from '@shopify/flash-list'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { UserView, UserViewProps } from '../../../components/userView'
import { ItemSeparator } from '../../../components/itemSeparator'
import { textTimeSincePost } from '../../../functions/textTimeSince'
import SafeView from '../../../components/safeView'

export default function Messages() {
    const { user: authenticatedUser } = useUserAuthenticated()
    const userAthenticatedId = authenticatedUser?.id || ''

    const [visibleModalContacts, setVisibleModalContacts] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>()
    const [refreshing, setRefreshing] = useState(true)

    const debounce = useRef<NodeJS.Timeout>(undefined)

    const searchConversations = useCallback(() => {
        setRefreshing(true)
        clearTimeout(debounce.current)

        debounce.current = setTimeout(async () => {
            const conversations = await apiGetUserConversations()
            setConversations(conversations)
            setRefreshing(false)
        }, 150)
    }, [])

    useFocusEffect(
        useCallback(() => {
            searchConversations()

            return () => {
                clearTimeout(debounce.current)
            }
        }, [searchConversations])
    )

    return (
        <SafeView className="relative flex-1 bg-white" edges={['top']}>
            <ContactList
                visible={visibleModalContacts}
                whenClose={() => {
                    setVisibleModalContacts(false)
                }}
                whenSelected={async (contact) => {
                    await saveCache('CONVERSATION_CONTACT', contact)

                    setVisibleModalContacts(false)
                    router.push('/authenticated/conversation/novo')
                }}
            />

            <TouchableOpacity className="absolute bottom-2 right-2 p-4 bg-headline rounded-full z-10" onPress={() => setVisibleModalContacts(true)}>
                <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
            </TouchableOpacity>

            <View className="relative mt-2 pb-2 h-10 items-center justify-center border-b border-stone-100">
                <Text style={{ fontSize: 18 }} className="font-semibold">
                    Conversas
                </Text>
            </View>
            <View className="flex-1">
                <FlashList
                    data={conversations ?? []}
                    ListEmptyComponent={() =>
                        typeof conversations !== 'undefined' && (
                            <View className="flex-1 items-center justify-center p-5" style={{ gap: 12 }}>
                                <MaterialCommunityIcons name="chat-outline" size={64} color="#dcdcdc" />
                                <View style={{ gap: 4 }}>
                                    <Text className="text-stone-500 text-center font-bold">Nenhuma conversa encontrada</Text>
                                    <Text className="text-stone-500">Toque no botão + para iniciar uma nova conversa</Text>
                                </View>
                            </View>
                        )
                    }
                    refreshing={refreshing}
                    onRefresh={searchConversations}
                    estimatedItemSize={100}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={({ item: { id, updatedAt, messages = [], participants = [] } }) => {
                        const [ultimaMensagem] = messages
                        const participant = participants.find((p) => p.role === 'SENDER_RECIPIENT' || p.user.id !== userAthenticatedId)

                        const timeSinceLastUpdate = textTimeSincePost(updatedAt)

                        let user: UserViewProps = {
                            title:
                                participant?.organization?.displayName ||
                                participant?.organization?.name ||
                                participant?.user.displayName ||
                                participant?.user.name ||
                                authenticatedUser?.name ||
                                '',
                            urlPicture: participant?.organization?.pictureUrl || participant?.user.pictureUrl || authenticatedUser?.pictureUrl || '',
                            info: ultimaMensagem?.content || '',
                            type: participant?.organization ? 'organization' : 'user',
                            verified: participant?.organization?.verified,
                            numberLinesInfo: 2,
                            rightTopText: timeSinceLastUpdate,
                        }

                        return (
                            <TouchableOpacity
                                className="p-2"
                                onPress={async () => {
                                    await saveCache('CONVERSATION_CONTACT', {
                                        displayName: user.title,
                                        pictureUrl: user.urlPicture,
                                        type: user.type,
                                        id: participant?.organization?.id || participant?.user.id || authenticatedUser?.id,
                                        verified: user.verified,
                                        name: user.title,
                                        role: participant?.role,
                                    } as Contact)

                                    router.push(`/authenticated/conversation/${id}`)
                                }}>
                                <UserView {...user} />
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </SafeView>
    )
}
