import { View, ScrollView } from 'react-native'
import { Header } from '../../../components/header'
import { useEffect } from 'react'

import { PendingOrganizations } from '../../../components/notifications/pendingOrganization'

export default function Notifications() {
    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = () => {}

    return (
        <View className="flex-1 bg-white">
            <Header title="Notificações" backButton />

            <ScrollView>
                <View className="p-2">
                    <PendingOrganizations />
                </View>
            </ScrollView>
        </View>
    )
}
