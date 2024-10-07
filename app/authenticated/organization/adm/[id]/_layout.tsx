import { Stack, useLocalSearchParams } from 'expo-router'
import { OrganizationProvider } from '../../../../../components/context/organization'

export default function Layout() {
    const { id } = useLocalSearchParams() as { id: string }

    return (
        <OrganizationProvider id={id}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </OrganizationProvider>
    )
}
