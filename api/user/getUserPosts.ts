import { apiAuthenticated } from '../route'
import { FeedPosts, Post } from './getUserFeed'

interface Params {
    id: string
    lastPostId?: string
}

export async function apiGetUserPosts({ id, lastPostId }: Params): Promise<FeedPosts> {
    try {
        const result = await (
            await apiAuthenticated()
        ).get<Post[]>(`/user/${id}/posts`, {
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
