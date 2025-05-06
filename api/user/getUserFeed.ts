import { apiAuthenticated } from '../route'

export interface Post {
    id: string
    title: string
    content: string
    likesCount: number
    updatedAt: string
    createdAt: string
    startDate?: string
    endDate?: string
    level?: 'NORMAL' | 'IMPORTANT' | 'URGENT'
    user?: {
        id: string
        name: string
        displayName: string
        pictureUrl: string
    }
    address?: {
        city: string
        state: string
        country: string
        street: string
        number: string
        neighborhood: string
        complement: string
        zipCode: string
    }
    organization?: {
        id: string
        name: string
        displayName: string
        pictureUrl: string
        verified: boolean
    }
    medias: {
        media: {
            id: string
            mediaUrl: string
            description: string
            blurhash?: string
        }
    }[]
    likes: {
        userId: string
        postId: string
        updatedAt: string
    }[]
}

export interface FeedPosts {
    itens: Post[]
    lastPostId?: string
}

interface Params {
    lastPostId?: string
}

export async function apiGetUserFeed({ lastPostId }: Params): Promise<FeedPosts> {
    try {
        const result = await (
            await apiAuthenticated()
        ).get<Post[]>(`/user/posts`, {
            params: {
                lastPostId,
            },
        })

        if (!result) throw new Error('No result')

        return {
            itens: result.data || [],
            lastPostId: result.headers['last-post-id'],
        }
    } catch {
        return {
            itens: [],
        }
    }
}
