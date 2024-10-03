import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Button } from '../button'
import { Counter } from '../counter'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { OrganizationPosts } from './posts'
import { apiOrganizationFindById, OrganizationSimple } from '../../api/organization/findById'
import { Header } from '../header'
import { useUserAuthenticated } from '../../hooks/authenticated'
import { OrganizationMembers } from './members'
import { OrganizationResume } from './resume'
import { OrganizationContext } from '../../hooks/organization'

interface Params {
    id: string
    header?: boolean
}

const Tab = createMaterialTopTabNavigator()

export function Organization({ id, header }: Params) {
    const session = useUserAuthenticated()

    const [loading, setLoading] = useState<string | undefined>('organization')
    const [organization, setOrganization] = useState<OrganizationSimple>()

    useEffect(() => {
        handleOrganization()
    }, [])

    const handleOrganization = () => {
        setLoading('organization')
        debounce(fetchOrganization, 1000)()
    }

    const fetchOrganization = async () => {
        setLoading('user')
        try {
            const { data } = await apiOrganizationFindById(id)
            setOrganization(data)
        } catch (error) {
            setOrganization(undefined)
        } finally {
            setLoading(undefined)
        }
    }

    if (loading === 'organization') {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#c5c5c5" />
            </View>
        )
    }

    if (!organization) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Usuário não encontrado</Text>
            </View>
        )
    }

    const OrganizationCell = (
        <ScrollView className="flex-1" stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 20 }} className="mb-2">
                <Text className="font-semibold" style={{ fontSize: 24 }}>
                    {organization.name}
                </Text>

                <View className="flex-row items-center" style={{ gap: 20 }}>
                    <Image source={organization.pictureUrl} className="h-20 w-20 rounded-full" />
                    <View className="flex-1">
                        <View className="flex-row justify-center items-center flex-1" style={{ gap: 14 }}>
                            <Counter title="Membros" value={0} />
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
                    <View className="flex-1">
                        <Button onPress={() => {}} text="Conectar" className="flex-1" />
                    </View>
                    {(session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR') && (
                        <View className="flex-1">
                            <Button onPress={() => {}} text="Editar perfil" variant="outline" className="flex-1" />
                        </View>
                    )}
                </View>
            </View>

            <View className="flex-1 min-h-screen">
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: '#000000',
                        tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
                        tabBarIndicatorStyle: { backgroundColor: '#000000' },
                        tabBarStyle: {},
                    }}>
                    <Tab.Screen name="resume" component={OrganizationResume} options={{ tabBarLabel: 'Resumo' }} />
                    <Tab.Screen name="posts" component={OrganizationPosts} options={{ tabBarLabel: 'Postagens' }} />
                    <Tab.Screen name="members" component={OrganizationMembers} options={{ tabBarLabel: 'Membros' }} />
                </Tab.Navigator>
            </View>
        </ScrollView>
    )

    if (header) {
        return (
            <OrganizationContext.Provider value={organization}>
                <View className="flex-1 bg-white">
                    <Header backButton />
                    <View className="flex-1 px-2">{OrganizationCell}</View>
                </View>
            </OrganizationContext.Provider>
        )
    }

    return (
        <OrganizationContext.Provider value={organization}>
            <View className="flex-1 bg-white p-2">
                <SafeAreaView className="flex-1">{OrganizationCell}</SafeAreaView>
            </View>
        </OrganizationContext.Provider>
    )
}
