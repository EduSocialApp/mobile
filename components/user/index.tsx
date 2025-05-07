import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { Button } from '../button'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { ProfilePosts } from './posts'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ProfileOrganizations } from './organizations'
import { ModalUserQrCode } from './modals/userQrcode'
import { UserProvider } from '../context/user'
import { useUser } from '../../hooks/user'
import { ProfileFamily } from './family'
import { ModalEditProfile } from './modals/editProfile'
import { placeholderImage } from '../../functions/placeholderImage'
import { HeaderOptionsContext } from '../../hooks/headerOptions'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Constants from 'expo-constants'
import { BioBubble } from '../bioBubble'

interface Params {
    id: string
    header?: boolean
    withConfig?: boolean
}

const Tab = createMaterialTopTabNavigator()

const TOPBAR_HEIGHT = Constants.statusBarHeight + 4
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

function calculeHeaderHeight(scrollY: number, headerHeightBase: number = HEADER_HEIGHT) {
    const headerHeight = headerHeightBase - scrollY

    if (headerHeight < 0) {
        return 0
    }

    if (headerHeight > headerHeightBase) {
        return headerHeightBase
    }

    return headerHeight
}

function ProfileRender({ header }: Params) {
    const userContext = useUser()
    if (!userContext) return null

    let {
        user: { displayName, pictureUrl, biography, supervisedUsers, supervisorUsers },
        myProfile,
        refresh,
    } = userContext

    const headerHeightBase = myProfile ? HEADER_HEIGHT : HEADER_HEIGHT - 65 // Remove tamanho dos botoes de edicao de perfil

    const headerHeight = useSharedValue(headerHeightBase)

    const haveFamily = (supervisedUsers?.length || 0) > 0 || (supervisorUsers?.length || 0) > 0

    const setHeaderHeight = (height: number) => {
        headerHeight.value = withTiming(calculeHeaderHeight(height, headerHeightBase), { duration: 300 })
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
            opacity: headerHeight.value / headerHeightBase - 0.1,
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

    if (!biography) {
        if (myProfile) {
            biography = 'Você ainda não preencheu sua biografia. Que tal contar um pouco sobre você?'
        } else {
            biography = 'Olá! Que bom ter você por aqui no meu perfil do EduSocial 😁'
        }
    }

    return (
        <HeaderOptionsContext.Provider
            value={{
                headerHeight: headerHeightBase,
                setHeaderHeight,
            }}>
            <View className="flex-1 relative bg-white">
                <View className="flex-row justify-between items-center p-2" style={{ gap: 8, marginTop: TOPBAR_HEIGHT }}>
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
                            <BioBubble text={biography} numberOfLines={3} />
                        </View>
                    </View>

                    {myProfile && (
                        <View className="flex-row items-center" style={{ gap: 8 }}>
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
                        </View>
                    )}
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
            <ProfileRender {...params} />
        </UserProvider>
    )
}
