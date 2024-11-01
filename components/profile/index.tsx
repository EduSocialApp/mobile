import { useState } from 'react'
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Button } from '../button'
import { Counter } from '../counter'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { ProfilePosts } from './posts'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Header } from '../header'
import { ProfileOrganizations } from './organizations'
import { ModalUserQrCode } from './modals/userQrcode'
import { UserProvider } from '../context/user'
import { useUser } from '../../hooks/user'
import { ProfileFamily } from './family'
import { ModalEditProfile } from './modals/editProfile'
import { placeholderImage } from '../../functions/placeholderImage'
import { HeaderOptionsContext } from '../../hooks/headerOptions'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface Params {
    id: string
    header?: boolean
    withConfig?: boolean
}

const Tab = createMaterialTopTabNavigator()

const HEADER_HEIGHT = 160

function ShareProfileButton() {
    const [openUserLinkShareable, setOpenUserLinkShareable] = useState<boolean>(false)

    return (
        <View className="flex-1">
            <ModalUserQrCode onClose={() => setOpenUserLinkShareable(false)} visible={openUserLinkShareable} />
            <Button onPress={() => setOpenUserLinkShareable(true)} text="Compartilhar" variant="outline" className="flex-1" size="sm" />
        </View>
    )
}

function calculeHeaderHeight(scrollY: number) {
    const headerHeight = HEADER_HEIGHT - scrollY

    if (headerHeight < 0) {
        return 0
    }

    if (headerHeight > HEADER_HEIGHT) {
        return HEADER_HEIGHT
    }

    return headerHeight
}

function ProfileRender({ header }: Params) {
    const userContext = useUser()
    if (!userContext) return null

    const {
        user: { displayName, pictureUrl, biography, organizations, role, supervisedUsers, supervisorUsers },
        isModerator,
        myProfile,
        refresh,
    } = userContext

    const headerHeight = useSharedValue(HEADER_HEIGHT)

    const haveFamily = (supervisedUsers?.length || 0) > 0 || (supervisorUsers?.length || 0) > 0

    const setHeaderHeight = (height: number) => {
        headerHeight.value = withTiming(calculeHeaderHeight(height), { duration: 300 })
    }

    const headerStyle = useAnimatedStyle(() => {
        return {
            height: headerHeight.value,
            paddingHorizontal: 10,
            gap: 20,
        }
    })

    const headerProfileStyle = useAnimatedStyle(() => {
        return {
            opacity: headerHeight.value / HEADER_HEIGHT - 0.1,
        }
    })

    const EditProfileButton = () => {
        const [openEditProfileModal, setOpenEditProfileModal] = useState<boolean>(false)

        return (
            <View className="flex-1">
                <ModalEditProfile
                    editing={openEditProfileModal}
                    onClose={() => {
                        setOpenEditProfileModal(false)
                        refresh()
                    }}
                />
                <Button onPress={() => setOpenEditProfileModal(true)} text="Editar perfil" variant="outline" className="flex-1" size="sm" />
            </View>
        )
    }

    return (
        <HeaderOptionsContext.Provider
            value={{
                headerHeight: HEADER_HEIGHT,
                setHeaderHeight,
            }}>
            <View className="flex-1 relative">
                <View className="flex-row justify-between items-center p-2" style={{ gap: 8 }}>
                    {header && (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Entypo name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>
                    )}

                    <Text className="font-semibold flex-1" numberOfLines={1} style={{ fontSize: 24 }}>
                        {displayName}
                    </Text>
                </View>

                <Animated.View style={headerStyle}>
                    <View className="flex-row items-center mt-2" style={{ gap: 18 }}>
                        <Animated.View style={headerProfileStyle}>
                            <Image source={pictureUrl} placeholder={placeholderImage} className="h-20 w-20 rounded-full border-2 border-stone-200" />
                        </Animated.View>
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
                                <EditProfileButton />
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
                </Animated.View>

                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: '#000000',
                        tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
                        tabBarIndicatorStyle: { backgroundColor: '#000000' },
                        tabBarStyle: {},
                    }}>
                    <Tab.Screen name="posts" component={ProfilePosts} options={{ tabBarLabel: 'Postagens' }} />
                    <Tab.Screen name="organizations" component={ProfileOrganizations} options={{ tabBarLabel: 'Instituições' }} />
                    {haveFamily && <Tab.Screen name="family" component={ProfileFamily} options={{ tabBarLabel: 'Família' }} />}
                </Tab.Navigator>
            </View>
        </HeaderOptionsContext.Provider>
    )
}

export function Profile(params: Params) {
    return (
        <UserProvider id={params.id}>
            <SafeAreaView className="flex-1 bg-white">
                <ProfileRender {...params} />
            </SafeAreaView>
        </UserProvider>
    )
}
