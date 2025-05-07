import { apiAuthenticated } from '../route'

export async function apiContacList(): Promise<Contact[]> {
    try {
        const result = await (await apiAuthenticated()).get<ContactList>(`/user/contactList`)

        if (!result.data) throw new Error('No result')

        const contactList: Contact[] = []

        if (result.data.organizations) {
            result.data.organizations.forEach(({ role, organization: { id, name, displayName, pictureUrl, verified } }) => {
                contactList.push({
                    id,
                    verified,
                    name,
                    displayName,
                    pictureUrl,
                    type: 'organization',
                    role,
                })
            })
        }

        if (result.data.supervisedUsers) {
            result.data.supervisedUsers.forEach(({ supervisedUser: { id, name, displayName, pictureUrl } }) => {
                contactList.push({
                    id,
                    name,
                    displayName,
                    pictureUrl,
                    type: 'user',
                    role: '',
                    verified: false,
                })
            })
        }

        if (result.data.supervisorUsers) {
            result.data.supervisorUsers.forEach(({ supervisorUser: { id, name, displayName, pictureUrl } }) => {
                contactList.push({
                    id,
                    name,
                    displayName,
                    pictureUrl,
                    type: 'user',
                    role: '',
                    verified: false,
                })
            })
        }

        return contactList
    } catch {
        // nao faz nada
    }

    return []
}
