import { createContext, useContext } from 'react'

export const HeaderOptionsContext = createContext<{
    headerHeight: number
    setHeaderHeight: (height: number) => void
}>({
    headerHeight: 0,
    setHeaderHeight: () => {},
})

export function useHeaderOptions() {
    try {
        const context = useContext(HeaderOptionsContext)
        return context
    } catch {
        return {
            setHeaderHeight: () => {},
            headerHeight: 0,
        }
    }
}
