import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { apiGetUserById } from '../../api/user/get'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Button } from '../button'
import { Counter } from '../counter'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { ProfilePosts } from './posts'
import { Administration } from './administration'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface Params {
    id: string
}

const Tab = createMaterialTopTabNavigator()

export function Profile({ id }: Params) {
    const [loading, setLoading] = useState<string | undefined>('user')
    const [user, setUser] = useState<User>()

    useEffect(() => {
        handleUser()
    }, [])

    const handleUser = () => {
        setLoading('user')
        debounce(fetchUser, 1000)()
    }

    const fetchUser = async () => {
        setLoading('user')
        try {
            const { data } = await apiGetUserById(id)
            setUser(data)
        } catch (error) {
            setUser(undefined)
        } finally {
            setLoading(undefined)
        }
    }

    if (loading === 'user') {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#c5c5c5" />
            </View>
        )
    }

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Usuário não encontrado</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white p-2">
            <SafeAreaView className="flex-1">
                <View style={{ gap: 20 }} className="mb-2">
                    <Text className="font-semibold" style={{ fontSize: 24 }}>
                        {user.name}
                    </Text>

                    <View className="flex-row items-center" style={{ gap: 20 }}>
                        <Image source={user.pictureUrl} className="h-20 w-20 rounded-full" />
                        <View className="flex-1">
                            <View className="flex-row justify-center items-center flex-1" style={{ gap: 14 }}>
                                <Counter title="Instituições" value={user.organizations.length} />
                                <Counter title="Prêmios" value={0} />
                                <Counter title="Curtidas" value={0} />
                            </View>
                            <Text className="text-stone-500 mt-1 text-sm" numberOfLines={2}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                                inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                                quibusdam.
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row" style={{ gap: 14 }}>
                        {id !== 'me' && (
                            <View className="flex-1">
                                <Button onPress={() => {}} text="Conectar" className="flex-1" />
                            </View>
                        )}
                        {id === 'me' && (
                            <View className="flex-1">
                                <Button onPress={() => {}} text="Editar perfil" variant="outline" className="flex-1" />
                            </View>
                        )}
                        {id === 'me' && (
                            <Button
                                onPress={() => {
                                    router.push('/authenticated/settings')
                                }}
                                variant="outline"
                                className="flex-1">
                                <MaterialCommunityIcons name="cog" size={24} />
                            </Button>
                        )}
                    </View>
                </View>

                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: '#000000',
                        tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
                        tabBarIndicatorStyle: { backgroundColor: '#000000' },
                        tabBarStyle: {},
                    }}>
                    <Tab.Screen name="posts" component={ProfilePosts} options={{ tabBarLabel: 'Postagens' }} />
                    {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
                        <Tab.Screen name="administration" component={Administration} options={{ tabBarLabel: 'Administração' }} />
                    )}
                </Tab.Navigator>
            </SafeAreaView>
        </View>
    )
}
