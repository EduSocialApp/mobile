import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
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
import { Header } from '../header'
import { ProfileOrganizations } from './organizations'
import { useUserAuthenticated } from '../../hooks/authenticated'
import { ModalUserQrCode } from '../modals/userQrcode'
import { UserProvider } from '../context/user'
import { useUser } from '../../hooks/user'

interface Params {
    id: string
    header?: boolean
    withConfig?: boolean
}

const Tab = createMaterialTopTabNavigator()

function ShareProfileButton() {
    const [openUserLinkShareable, setOpenUserLinkShareable] = useState<boolean>(false)

    return (
        <View className="flex-1">
            <ModalUserQrCode onClose={() => setOpenUserLinkShareable(false)} visible={openUserLinkShareable} />
            <Button onPress={() => setOpenUserLinkShareable(true)} text="Compartilhar" variant="outline" className="flex-1" size="sm" />
        </View>
    )
}

function ProfileRender() {
    const userContext = useUser()
    if (!userContext) return null

    const {
        user: { displayName, pictureUrl, biography, organizations, role },
        isModerator,
        myProfile,
    } = userContext

    return (
        <ScrollView className="flex-1" stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 20 }} className="mb-2">
                <Text className="font-semibold" style={{ fontSize: 24 }}>
                    {displayName}
                </Text>

                <View className="flex-row items-center" style={{ gap: 18 }}>
                    <Image source={pictureUrl} className="h-20 w-20 rounded-full border-2 border-stone-200" />
                    <View className="flex-1">
                        <View className="flex-row justify-between items-center flex-1 px-2" style={{ gap: 14 }}>
                            <Counter title="instituições" value={organizations.length} />
                            <Counter title="prêmios" value={0} />
                            <Counter title="curtidas" value={0} />
                        </View>
                        {biography && (
                            <Text className="text-stone-500 mt-1 text-sm" numberOfLines={2}>
                                {biography}
                            </Text>
                        )}
                        {!biography && myProfile && (
                            <Text className="text-stone-500 mt-1 text-sm italic">Você pode adicionar uma biografia editando seu perfil</Text>
                        )}
                    </View>
                </View>

                <View className="flex-row" style={{ gap: 14 }}>
                    {/* {id !== 'me' && (
                        <View className="flex-1">
                            <Button onPress={() => {}} text="Conectar" className="flex-1" />
                        </View>
                    )} */}
                    {myProfile && (
                        <>
                            <View className="flex-1">
                                <Button onPress={() => {}} text="Editar perfil" variant="outline" className="flex-1" size="sm" />
                            </View>
                            <ShareProfileButton />
                            <Button
                                onPress={() => {
                                    router.push('/authenticated/settings')
                                }}
                                variant="outline"
                                className="flex-1"
                                size="sm">
                                <MaterialCommunityIcons name="cog" size={24} />
                            </Button>
                        </>
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
                    <Tab.Screen name="posts" component={ProfilePosts} options={{ tabBarLabel: 'Postagens' }} />
                    <Tab.Screen name="organizations" component={ProfileOrganizations} options={{ tabBarLabel: 'Instituições' }} />
                </Tab.Navigator>
            </View>
        </ScrollView>
    )
}

export function Profile({ id, header }: Params) {
    if (header) {
        return (
            <UserProvider id={id}>
                <View className="flex-1 bg-white">
                    <Header backButton />
                    <View className="flex-1 px-2">
                        <ProfileRender />
                    </View>
                </View>
            </UserProvider>
        )
    }

    return (
        <UserProvider id={id}>
            <View className="flex-1 bg-white p-2">
                <SafeAreaView className="flex-1">
                    <ProfileRender />
                </SafeAreaView>
            </View>
        </UserProvider>
    )
}
