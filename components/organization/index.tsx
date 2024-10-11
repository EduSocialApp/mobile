import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Button } from '../button'
import { Counter } from '../counter'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { OrganizationPosts } from './posts'
import { Header } from '../header'
import { OrganizationMembers } from './members'
import { useOrganization } from '../../hooks/organization'
import { OrganizationProvider } from '../context/organization'
import { OrganizationResume } from './modals/OrganizationResume'
import { VerifiedBadge } from '../verifiedBadge'
import { useUserAuthenticated } from '../../hooks/authenticated'

interface Params {
    id: string
    header?: boolean
}

const Tab = createMaterialTopTabNavigator()

function OrganizationRender() {
    const user = useUserAuthenticated()
    const org = useOrganization()
    if (!org) return null

    const { displayName, pictureUrl, biography, verified } = org.organization

    return (
        <ScrollView className="flex-1" stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 20 }} className="mb-2">
                <View className="flex-row justify-between relative" style={{ gap: 20 }}>
                    <View className="flex-row flex-1 items-center" style={{ gap: 4 }}>
                        <Text className="font-semibold" numberOfLines={1} style={{ fontSize: 24 }}>
                            {displayName}
                        </Text>
                        {verified && <VerifiedBadge type="organization" size="lg" />}
                    </View>
                    {user.isModerator && (
                        <View className="absolute right-0 top-0">
                            <OrganizationResume />
                        </View>
                    )}
                </View>

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
                    {(org.isOwner || user.isAdmin) && (
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
                    <Tab.Screen name="posts" component={OrganizationPosts} options={{ tabBarLabel: 'Postagens' }} />
                    {(org.isMember || user.isModerator) && (
                        <Tab.Screen name="members" component={OrganizationMembers} options={{ tabBarLabel: 'Membros' }} />
                    )}
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
