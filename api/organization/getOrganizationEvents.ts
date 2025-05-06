import { postsToEventGroup } from '../../functions/postsToEventGroup'
import { apiAuthenticated } from '../route'
import { Post } from '../user/getUserFeed'

interface Params {
    id: string
}

export async function apiGetOrganizationEvents({ id }: Params): Promise<EventGroup[]> {
    try {
        const result = await (await apiAuthenticated()).get<Post[]>(`/org/${id}/events`)

        if (!result) throw new Error('No result')

        return postsToEventGroup(result.data)
    } catch {
        return []
    }
}
