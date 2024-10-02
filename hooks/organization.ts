import { createContext, useContext } from 'react'
import { OrganizationSimple } from '../api/organization/findById'

export const OrganizationContext = createContext<OrganizationSimple | null>(null)

export function useOrganization() {
    return useContext(OrganizationContext)
}
