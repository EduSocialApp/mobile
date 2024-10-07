import { createContext, useContext } from 'react'
import { OrganizationSimple } from '../api/organization/findById'

export const OrganizationContext = createContext<{
    organization: OrganizationSimple
    userLoggedRole: string
    permissons: {
        viewResume: boolean
        viewMembers: boolean
        editProfile: boolean
    }
} | null>(null)

export function useOrganization() {
    return useContext(OrganizationContext)
}
