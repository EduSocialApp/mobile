import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Button } from '../button'
import { Counter } from '../counter'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { OrganizationPosts } from './posts'
import { Header } from '../header'
import { OrganizationMembers } from './members'
import { OrganizationResume } from './resume'
import { useOrganization } from '../../hooks/organization'
import { OrganizationProvider } from '../context/organization'

interface Params {
    id: string
    header?: boolean
}

const Tab = createMaterialTopTabNavigator()

function OrganizationRender() {
    const org = useOrganization()
    if (!org) return null

    const { displayName, pictureUrl, biography } = org.organization
    const { editProfile, viewMembers, viewResume } = org.permissons

    return (
        <ScrollView className="flex-1" stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 20 }} className="mb-2">
                <Text className="font-semibold" style={{ fontSize: 24 }}>
                    {displayName}
                </Text>

                <View className="flex-row items-center" style={{ gap: 18 }}>
                    <Image source={pictureUrl} className="h-20 w-20 rounded-lg border border-stone-200" />
                    <View className="flex-1">
                        <View className="flex-row justify-between mx-2 items-center flex-1" style={{ gap: 14 }}>
                            <Counter title="Membros" value={0} />
                            <Counter title="Prêmios" value={0} />
                            <Counter title="Curtidas" value={0} />
                        </View>
                        {biography && (
                            <Text className="text-stone-500 mt-1 text-sm" numberOfLines={2}>
                                {biography}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="flex-row" style={{ gap: 14 }}>
                    <View className="flex-1">
                        <Button onPress={() => {}} text="Conectar" className="flex-1" />
                    </View>
                    {editProfile && (
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
                    {viewResume && <Tab.Screen name="resume" component={OrganizationResume} options={{ tabBarLabel: 'Resumo' }} />}
                    <Tab.Screen name="posts" component={OrganizationPosts} options={{ tabBarLabel: 'Postagens' }} />
                    {viewMembers && <Tab.Screen name="members" component={OrganizationMembers} options={{ tabBarLabel: 'Membros' }} />}
                </Tab.Navigator>
            </View>
        </ScrollView>
    )
}

export function Organization({ id, header }: Params) {
    if (header) {
        return (
            <OrganizationProvider id={id}>
                <View className="flex-1 bg-white">
                    <Header backButton />
                    <View className="flex-1 px-2">
                        <OrganizationRender />
                    </View>
                </View>
            </OrganizationProvider>
        )
    }

    return (
        <OrganizationProvider id={id}>
            <View className="flex-1 bg-white p-2">
                <SafeAreaView className="flex-1">
                    <OrganizationRender />
                </SafeAreaView>
            </View>
        </OrganizationProvider>
    )
}
