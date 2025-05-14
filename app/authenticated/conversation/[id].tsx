import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native'
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { DataNotFound } from '../../../components/404'
import { UserView } from '../../../components/userView'
import { TextInput } from '../../../components'
import SafeView from '../../../components/safeView'
import { Controller, useForm } from 'react-hook-form'
import { apiNewConversation } from '../../../api/conversation/newConversation'
import { apiGetConversation } from '../../../api/conversation/getConversation'
import { FlashList } from '@shopify/flash-list'
import { MessageItem } from '../../../components/messages/item'
import { readCache } from '../../../cache/asyncStorage'
import { apiNewMessage } from '../../../api/message/newMessage'
import { socketConnect, socketDisconnect } from '../../../api/socketConnect'
import { randomId } from '../../../functions/randomId'
import { useUserAuthenticated } from '../../../hooks/authenticated'

interface Form {
    text: string
}

export default function Conversation() {
    const { id } = useLocalSearchParams()
    const { user: authenticatedUser } = useUserAuthenticated()

    const [sending, setSending] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [recipient, setRecipient] = useState<Contact>()
    const [messages, setMessages] = useState<Message[]>()

    const { control, getValues, setValue } = useForm<Form>({
        defaultValues: {
            text: '',
        },
    })

    const debounceRecipient = useRef<NodeJS.Timeout>(undefined)
    const debounceConversation = useRef<NodeJS.Timeout>(undefined)
    const idRef = useRef<string>(id as string)
    const flashListRef = useRef<FlashList<any>>(null)
    const messagesRef = useRef<Message[]>([])

    useEffect(() => {
        fetchRecipient()
        fetchMessages()

        configSocket()
        return () => {
            socketDisconnect()
        }
    }, [id])

    // Para cada nova mensagem, desce o scroll
    useEffect(() => {
        if (messages?.length) {
            flashListRef.current?.scrollToEnd({ animated: false })
            messagesRef.current = messages // Salva espelho das mensagens para ser checado no socket
        }
    }, [messages?.length])

    const configSocket = async () => {
        const socket = await socketConnect()

        socket.on('newMessage', (data: Message) => {
            try {
                // Verifica se a mensagem é dessa conversa
                if (data.conversationId !== idRef.current) return

                // Pesquisa se a mensagem já está inserida
                if (messagesRef.current) {
                    const messageExists = messagesRef.current.find(
                        (message) =>
                            (message.id && message.id === data.id) || (message.messageClientId && message.messageClientId === data.messageClientId)
                    )

                    if (messageExists) return
                }

                // Caso não exista, adiciona na lista
                setMessages([...messagesRef.current, data])
            } catch {
                // nao faz nada
            }
        })
    }

    const fetchRecipient = async () => {
        clearTimeout(debounceRecipient.current)

        debounceRecipient.current = setTimeout(async () => {
            const cache = await readCache('CONVERSATION_CONTACT')
            setRecipient(cache.value as Contact)
        }, 100)
    }

    const fetchMessages = async () => {
        if (!idRef.current || idRef.current === 'novo') {
            setMessages([])
            return
        }

        clearTimeout(debounceConversation.current)
        setRefreshing(true)

        debounceConversation.current = setTimeout(async () => {
            const conversation = await apiGetConversation(idRef.current, true, true)
            setMessages(conversation?.messages || [])

            setRefreshing(false)
        }, 100)
    }

    const sendMessage = async () => {
        const { text } = getValues()

        if (!text) {
            return
        }

        setSending(true)

        // Inicia uma nova conversa, caso o id seja 'novo'
        if (idRef.current === 'novo') {
            try {
                const request = await apiNewConversation({
                    content: text,
                    toUserId: recipient?.type === 'user' ? recipient?.id : undefined,
                    toOrganizationId: recipient?.type === 'organization' ? recipient?.id : undefined,
                })

                setValue('text', '')
                idRef.current = request.data.conversationId

                fetchMessages()
            } catch {
                alert('Erro ao iniciar conversa, tente novamente')
            } finally {
                setSending(false)
            }
            return
        }

        // Apenas envia uma nova mensagem na conversa
        try {
            const clientId = randomId()

            if (messages) {
                apiNewMessage(idRef.current, text, clientId)

                // Adiciona a nova mensagem na conversa localmente
                setMessages((prev) => [
                    ...(prev || []),
                    {
                        id: '',
                        messageClientId: clientId,
                        content: text,
                        createdAt: new Date().toISOString(),
                        conversationId: idRef.current,
                        user: {
                            id: authenticatedUser?.id || '',
                            displayName: authenticatedUser?.name || '',
                            pictureUrl: authenticatedUser?.pictureUrl || '',
                            name: authenticatedUser?.name || '',
                        },
                    },
                ])
            } else {
                await apiNewMessage(idRef.current, text)
                fetchMessages()
            }

            setValue('text', '')
        } catch {
            alert('Erro ao enviar mensagem, tente novamente')
        } finally {
            setSending(false)
        }
    }

    if (!recipient) {
        return <DataNotFound text="Usuário não encontrado" />
    }

    return (
        <SafeView className="bg-white">
            <View className="flex-row h-12 items-center border-b border-stone-200" style={{ gap: 12 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex-1">
                    <UserView
                        title={recipient.displayName || recipient.name}
                        urlPicture={recipient.pictureUrl}
                        type={recipient.type}
                        verified={recipient.verified}
                        photoSize="sm"
                    />
                </View>
            </View>
            <View className="flex-1 bg-stone-100">
                <FlashList
                    ref={flashListRef}
                    data={messages}
                    refreshing={refreshing}
                    onRefresh={fetchMessages}
                    ListEmptyComponent={() =>
                        typeof messages !== 'undefined' && (
                            <DataNotFound
                                Icon={<MaterialCommunityIcons name="chat-outline" size={64} color="#dcdcdc" />}
                                text="Nova conversa"
                                description="Envie a primeira mensagem para iniciar a conversa."
                            />
                        )
                    }
                    estimatedItemSize={100}
                    renderItem={({ item }) => <MessageItem {...item} />}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    contentContainerStyle={{ padding: 12 }}
                />
            </View>

            <View className="border-t border-stone-200 p-2 flex-row items-center" style={{ gap: 12 }}>
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="text"
                        render={({ field: { value, onChange } }) => (
                            <TextInput onChangeText={onChange} value={value} size="sm" editable={!sending} placeholder="Insira uma mensagem..." />
                        )}
                    />
                </View>
                <TouchableOpacity onPress={sendMessage} disabled={sending}>
                    {sending ? (
                        <View className="h-6 w-6 items-center justify-center">
                            <ActivityIndicator size={24} color="#272343" />
                        </View>
                    ) : (
                        <Ionicons name="send" size={24} color="#272343" />
                    )}
                </TouchableOpacity>
            </View>
        </SafeView>
    )
}
