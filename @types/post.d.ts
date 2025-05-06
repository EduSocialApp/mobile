type PostLevel = 'NORMAL' | 'IMPORTANT' | 'URGENT'

interface PostEvent {
    title: string
    description?: string
    start: Date
    end?: Date
    level?: PostLevel
    postId: string
    organization: {
        id: string
        name: string
        displayName: string
        pictureUrl: string
        verified: boolean
    }
    membersFamilyNotified: {
        id: string
        name: string
        displayName: string
        pictureUrl: string
    }[]
}

interface EventDay {
    day: number
    events: PostEvent[]
}

interface EventGroup {
    year: number
    month: number
    days: EventDay[]
}
