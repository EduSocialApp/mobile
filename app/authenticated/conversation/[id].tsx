import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { DataNotFound } from '../../../components/404'
import { UserBasicView } from '../../../components/userBasicView'
import { TextInput } from '../../../components'
import SafeView from '../../../components/safeView'
import { Controller, useForm } from 'react-hook-form'
import { apiNewConversation } from '../../../api/conversation/newConversation'
import { apiGetConversation } from '../../../api/conversation/getConversation'
import { FlashList } from '@shopify/flash-list'
import { MessageItem } from '../../../components/messages/item'
import { readCache } from '../../../cache/asyncStorage'
import { apiNewMessage } from '../../../api/message/newMessage'

interface Form {
    text: string
}

export default function Conversation() {
    const { id } = useLocalSearchParams()

    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(false)
    const [recipient, setRecipient] = useState<Contact>()
    const [conversation, setConversation] = useState<Conversation | null>(null)

    const { control, getValues, setValue } = useForm<Form>({
        defaultValues: {
            text: '',
        },
    })

    const debounceRecipient = useRef<NodeJS.Timeout>(undefined)
    const debounceConversation = useRef<NodeJS.Timeout>(undefined)
    const idRef = useRef<string>(id as string)

    useEffect(() => {
        fetchRecipient()
        fetchConversation()
    }, [id])

    const fetchRecipient = async () => {
        clearTimeout(debounceRecipient.current)

        debounceRecipient.current = setTimeout(async () => {
            const cache = await readCache('CONVERSATION_CONTACT')
            setRecipient(cache.value as Contact)
        }, 100)
    }

    const fetchConversation = async () => {
        if (!idRef.current || idRef.current === 'novo') {
            return
        }

        clearTimeout(debounceConversation.current)
        setLoading(true)

        debounceConversation.current = setTimeout(async () => {
            const conversation = await apiGetConversation(idRef.current, true, true)
            setConversation(conversation)

            setLoading(false)
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

                fetchConversation()
            } catch {
                alert('Erro ao iniciar conversa, tente novamente')
            } finally {
                setSending(false)
            }
            return
        }

        // Apenas envia uma nova mensagem na conversa
        try {
            await apiNewMessage(idRef.current, text)
            setValue('text', '')

            fetchConversation()
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
                    <UserBasicView
                        title={recipient.displayName || recipient.name}
                        urlPicture={recipient.pictureUrl}
                        type={recipient.type}
                        verified={recipient.verified}
                        photoSize="sm"
                    />
                </View>
            </View>

            <View className="flex-1 bg-stone-100 p-3">
                {conversation?.messages && (conversation?.messages || []).length > 0 && (
                    <FlashList
                        data={conversation?.messages}
                        estimatedItemSize={100}
                        renderItem={({ item }) => <MessageItem {...item} />}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    />
                )}
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
