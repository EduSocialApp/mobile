import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
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
import { placeholderImage } from '../../functions/placeholderImage'
import { useState } from 'react'
import { NewUserPostModal } from '../posts/modals/newUserPost'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { HeaderOptionsContext } from '../../hooks/headerOptions'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { NewOrganizationPostModal } from '../posts/modals/newOrganizationPost'

interface Params {
    id: string
    header?: boolean
}

const Tab = createMaterialTopTabNavigator()

const HEADER_HEIGHT = 160

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

function OrganizationRender() {
    const user = useUserAuthenticated()
    const org = useOrganization()
    if (!org) return null

    const { displayName, pictureUrl, biography, verified, stats } = org.organization

    const [visibleNewPostModal, setVisibleNewPostModal] = useState(false)

    const headerHeight = useSharedValue(HEADER_HEIGHT)

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

    return (
        <HeaderOptionsContext.Provider
            value={{
                headerHeight: HEADER_HEIGHT,
                setHeaderHeight,
            }}>
            <View className="flex-1 relative">
                <NewOrganizationPostModal
                    visible={visibleNewPostModal}
                    onClose={() => {
                        setVisibleNewPostModal(false)
                    }}
                />

                <TouchableOpacity
                    className="absolute bottom-2 right-2 p-4 bg-headline rounded-full z-10"
                    onPress={() => setVisibleNewPostModal(true)}>
                    <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
                </TouchableOpacity>

                <View className="flex-row justify-between items-center relative p-2" style={{ gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Entypo name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>

                    <View className="flex-row flex-1 items-center" style={{ gap: 4 }}>
                        <Text className="font-semibold" numberOfLines={1} style={{ fontSize: 24 }}>
                            {displayName}
                        </Text>
                        {verified && <VerifiedBadge type="organization" size="lg" />}
                    </View>

                    {user.isModerator && (
                        <View>
                            <OrganizationResume />
                        </View>
                    )}
                </View>

                <Animated.View style={headerStyle}>
                    <View className="flex-row items-center mt-2" style={{ gap: 18 }}>
                        <Animated.View style={headerProfileStyle}>
                            <Image source={pictureUrl} placeholder={placeholderImage} className="h-20 w-20 rounded-lg border border-stone-200" />
                        </Animated.View>
                        <View className="flex-1">
                            <View className="flex-row justify-between mx-2 items-center flex-1" style={{ gap: 14 }}>
                                <Counter title="Membros" value={stats?.members || 0} />
                                <Counter title="Medalhas" value={stats?.medals || 0} />
                                <Counter title="Curtidas" value={stats?.likes || 0} />
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
                </Animated.View>

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
        </HeaderOptionsContext.Provider>
    )
}

export function Organization({ id, header }: Params) {
    return (
        <OrganizationProvider id={id}>
            <SafeAreaView className="flex-1 bg-white">
                <OrganizationRender />
            </SafeAreaView>
        </OrganizationProvider>
    )
}
