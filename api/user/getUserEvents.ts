import { postsToEventGroup } from '../../functions/postsToEventGroup'
import { apiAuthenticated } from '../route'
import { Post } from './getUserFeed'

export async function apiGetUserEvents(): Promise<EventGroup[]> {
    try {
        const result = await (await apiAuthenticated()).get<Post[]>(`/user/events`)

        if (!result) throw new Error('No result')

        return postsToEventGroup(result.data)
    } catch {
        return []
    }
}
