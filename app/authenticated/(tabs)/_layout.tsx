import { MaterialCommunityIcons } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useUserAuthenticated } from '../../../hooks/authenticated'

export default function TabLayout() {
    const session = useUserAuthenticated()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
                headerShown: false,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Feed',
                    tabBarIcon: ({ color, focused, size }) => (
                        <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={32} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused, size }) => <MaterialCommunityIcons name="magnify" size={32} color={color} />,
                }}
            />
            <Tabs.Screen
                name="organizations"
                options={{
                    title: 'Organizations',
                    tabBarIcon: ({ color, focused, size }) => (
                        <MaterialCommunityIcons name={focused ? 'account-group' : 'account-group-outline'} size={32} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, focused, size }) => (
                        <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} size={32} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
