import { useEffect, useState } from 'react'
import { apiOrganizationFindById, OrganizationSimple } from '../../api/organization/findById'
import debounce from 'lodash/debounce'
import { apiOrganizationRole } from '../../api/organization/role'
import { ActivityIndicator, View, Text } from 'react-native'
import { OrganizationContext } from '../../hooks/organization'
import { useUserAuthenticated } from '../../hooks/authenticated'

interface Params {
    id: string
    children: React.ReactNode
}

export function OrganizationProvider({ id, children }: Params) {
    const user = useUserAuthenticated()?.user

    const [loading, setLoading] = useState<string | undefined>('organization')
    const [organization, setOrganization] = useState<OrganizationSimple>()
    const [userLoggedRole, setUserLoggedRole] = useState<string>('')

    useEffect(() => {
        handleOrganization()
    }, [])

    const handleOrganization = () => {
        setLoading('organization')
        debounce(fetchOrganization, 100)()
    }

    const fetchOrganization = async () => {
        setLoading('organization')
        try {
            const { data } = await apiOrganizationFindById(id)
            setOrganization(data)
        } catch (error) {
            setOrganization(undefined)
        }

        try {
            const { data: dataRole } = await apiOrganizationRole(id)
            setUserLoggedRole(dataRole?.role || '')
        } catch {
            setUserLoggedRole('')
        }

        // Espera 1 segundo para remover o loading (para evitar flickering)
        setLoading(undefined)
    }

    const permissions = () => {
        const userIsModerator = user?.role === 'ADMIN' || user?.role === 'MODERATOR' || userLoggedRole === 'OWNER' || userLoggedRole === 'MODERATOR'
        const userIsMember = userLoggedRole === 'OWNER' || userLoggedRole === 'MODERATOR' || userLoggedRole === 'USER'

        return {
            viewResume: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
            viewMembers: userIsMember,
            editProfile: userIsModerator,
        }
    }

    if (loading === 'organization') {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#c5c5c5" />
            </View>
        )
    }

    if (!organization) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Organização não encontrada</Text>
            </View>
        )
    }

    return (
        <OrganizationContext.Provider
            value={{
                reload: () => {
                    handleOrganization()
                },
                organization,
                userLoggedRole,
                isMember: userLoggedRole === 'OWNER' || userLoggedRole === 'MODERATOR' || userLoggedRole === 'USER',
                isMemberModerator: userLoggedRole === 'OWNER' || userLoggedRole === 'MODERATOR',
                isOwner: userLoggedRole === 'OWNER',
            }}>
            {children}
        </OrganizationContext.Provider>
    )
}
