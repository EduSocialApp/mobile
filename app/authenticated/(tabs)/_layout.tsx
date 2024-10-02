import { MaterialCommunityIcons } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useUserAuthenticated } from '../../../hooks/authenticated'

export default function TabLayout() {
    const session = useUserAuthenticated()

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'black', headerShown: false, tabBarShowLabel: false }}>
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Feed',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-variant" size={32} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="magnify" size={32} color={color} />,
                }}
            />
            <Tabs.Screen
                name="organizations"
                options={{
                    title: 'Organizations',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group" size={32} color={color} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => <FontAwesome name="user" size={32} color={color} />,
                }}
            />
        </Tabs>
    )
}
