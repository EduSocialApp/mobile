import { createContext, useContext } from 'react'

export const UserContext = createContext<{
    user: User
    myProfile: boolean
    isModerator: boolean
    refresh: () => void
} | null>(null)

export function useUser() {
    return useContext(UserContext)
}
