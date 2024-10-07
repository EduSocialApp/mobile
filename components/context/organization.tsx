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
        debounce(fetchOrganization, 1000)()
    }

    const fetchOrganization = async () => {
        setLoading('organization')
        try {
            const { data } = await apiOrganizationFindById(id)
            setOrganization(data)

            const { data: dataRole } = await apiOrganizationRole(id)
            setUserLoggedRole(dataRole?.role || '')
        } catch (error) {
            setOrganization(undefined)
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

    const userIsModerator = user?.role === 'ADMIN' || user?.role === 'MODERATOR'
    const userIsMemberModerator = userLoggedRole === 'OWNER' || userLoggedRole === 'MODERATOR'
    const userIsMember = userLoggedRole === 'OWNER' || userLoggedRole === 'MODERATOR' || userLoggedRole === 'USER'

    return (
        <OrganizationContext.Provider
            value={{
                organization,
                userLoggedRole,
                permissons: {
                    viewResume: userIsModerator,
                    viewMembers: userIsMember,
                    editProfile: userIsModerator || userIsMemberModerator,
                },
            }}>
            {children}
        </OrganizationContext.Provider>
    )
}
