import { apiAuthenticated } from '../route'
import { Post } from '../user/getUserFeed'

export async function apiGetPostById(id: string) {
    try {
        const post = await (await apiAuthenticated()).get<Post>(`/post/${id}`)

        if (post.data) {
            return post.data
        }
    } catch {
        // nao faz nada
    }

    return null
}
