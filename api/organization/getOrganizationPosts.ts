import { apiAuthenticated } from '../route'
import { FeedPosts, Post } from '../user/getUserFeed'

interface Params {
    id: string
    lastPostId?: string
}

export async function apiGetOrganizationPosts({ id, lastPostId }: Params): Promise<FeedPosts> {
    try {
        const result = await (
            await apiAuthenticated()
        ).get<Post[]>(`/org/${id}/posts`, {
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
