import { apiAuthenticated } from '../route'

export async function apiLikeOrUnlikePost(postId: string) {
    try {
        await (await apiAuthenticated()).post(`/post/${postId}/likeOrUnlike`)
    } catch {
        // nao faz nada
    }
}
