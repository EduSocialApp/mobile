import { apiAuthenticated } from '../../route'

interface Params {
    sharedUserCode: string
}

export async function apiLinkSupervisorToUser({ sharedUserCode }: Params) {
    return (await apiAuthenticated()).post<{ message: string }>(`/user/linkSupervisorToUser`, {
        sharedCode: sharedUserCode,
    })
}
