import { createContext, useContext } from 'react'
import { OrganizationSimple } from '../api/organization/findById'

export const OrganizationContext = createContext<{
    organization: OrganizationSimple
    userLoggedRole: string
    reload: () => void
    isMemberModerator: boolean
    isOwner: boolean
    isMember: boolean
} | null>(null)

export function useOrganization() {
    return useContext(OrganizationContext)
}
