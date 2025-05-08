interface ConversationUser {
    id: string
    displayName: string
    pictureUrl: string
    name: string
}

interface ConversationOrganization {
    id: string
    name: string
    pictureUrl: string
    verified: boolean
}

interface MessageMedia {
    blurhash: string
    mediaUrl: string
}

interface ConversationSenderUser {
    id: string
    displayName: string
    pictureUrl: string
    name: string
}

interface Message {
    id: string
    content: string
    createdAt: string
    user: ConversationUser
    media?: MessageMedia[]
}

interface ConversationParticipant {
    user: ConversationUser
    role: 'SENDER' | 'RECIPIENT' | 'MEMBER' | 'SENDER_RECIPIENT'
    organization?: ConversationOrganization
}

interface Conversation {
    id: string
    isPrivate: boolean
    createdAt: string
    updatedAt: string
    status: string
    messages?: Message[]
    participants?: ConversationParticipant[]
}
