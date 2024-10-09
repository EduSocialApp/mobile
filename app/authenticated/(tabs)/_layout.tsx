import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
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
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, focused, size }) => (
                        <MaterialCommunityIcons name={focused ? 'message-text' : 'message-text-outline'} size={32} color={color} />
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
