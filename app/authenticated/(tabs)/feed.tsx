import { SafeAreaView, TouchableOpacity, View } from 'react-native'
import { TitleBlack } from '../../../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import { apiGetHasNewNotifications } from '../../../api/user/hasNewNotifications'
import { router, useFocusEffect } from 'expo-router'
import { NewUserPostModal } from '../../../components/posts/modals/newUserPost'

export default function Feed() {
    const [hasNewNotifications, setHasNewNotifications] = useState(false)

    useFocusEffect(
        useCallback(() => {
            handleInit()

            return () => {}
        }, [])
    )

    const handleInit = () => {
        console.log('renderizou')
        apiGetHasNewNotifications()
            .then((res) => {
                setHasNewNotifications(res.data.total > 0)
            })
            .catch(console.log)
    }

    return (
        <SafeAreaView className="relative flex-1">
            <NewUserPostModal />
            <View className="relative mt-2 h-10 items-center justify-center">
                <TitleBlack />

                <View className="absolute t-0 w-full h-full items-end justify-center">
                    <TouchableOpacity onPress={() => router.push('/authenticated/notifications')} className="px-2 relative">
                        {hasNewNotifications && <View className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full z-10" />}
                        <MaterialCommunityIcons name={'bell-outline'} size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity className="absolute bottom-2 right-2 p-4 bg-headline rounded-full">
                <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}
