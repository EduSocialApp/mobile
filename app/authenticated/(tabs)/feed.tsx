import { useCallback, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { TitleBlack } from '../../../components'
import { apiGetHasNewNotifications } from '../../../api/user/hasNewNotifications'
import { NewUserPostModal } from '../../../components/posts/modals/newUserPost'
import { apiGetUserFeed, Post } from '../../../api/user/getUserFeed'
import { ListPosts } from '../../../components/posts/ListPosts'
import SafeView from '../../../components/safeView'

export default function Feed() {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState<Post[]>([])
    const [hasNewNotifications, setHasNewNotifications] = useState(false)
    const [visibleNewPostModal, setVisibleNewPostModal] = useState(false)

    useFocusEffect(
        useCallback(() => {
            handleInit()

            return () => {}
        }, [])
    )

    const lastPostId = useRef<string>(undefined)
    const isEndReached = useRef(false)

    const resetFeed = () => {
        isEndReached.current = false
        lastPostId.current = undefined
    }

    const handleInit = () => {
        apiGetHasNewNotifications()
            .then((res) => {
                setHasNewNotifications(res.data.total > 0)
            })
            .catch(console.log)

        resetFeed()
        fetchPosts([])
    }

    const fetchPosts = async (loadedItems: Post[] = posts) => {
        if (isEndReached.current) return

        const result = await apiGetUserFeed({ lastPostId: lastPostId.current })

        lastPostId.current = result.lastPostId

        if (result.itens.length === 1 || result.itens.length === 0) {
            isEndReached.current = true
        }

        setPosts([...loadedItems, ...result.itens])
        setLoading(false)
    }

    return (
        <SafeView className="bg-white" edges={['top']}>
            <View className="flex-1 relative">
                <NewUserPostModal
                    visible={visibleNewPostModal}
                    onClose={() => {
                        setVisibleNewPostModal(false)

                        resetFeed()
                        fetchPosts([])
                    }}
                />
                <View className="relative mt-2 pb-2 h-10 items-center justify-center border-b border-stone-100">
                    <TitleBlack />

                    <View className="absolute top-0 w-full h-full items-end justify-center">
                        <TouchableOpacity onPress={() => router.push('/authenticated/notifications')} className="px-2 relative">
                            {hasNewNotifications && <View className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full z-10" />}
                            <MaterialCommunityIcons name={'bell-outline'} size={28} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    className="absolute bottom-2 right-2 p-4 bg-headline rounded-full z-10"
                    onPress={() => setVisibleNewPostModal(true)}>
                    <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
                </TouchableOpacity>

                <ListPosts
                    posts={posts}
                    loading={loading}
                    onRefresh={(newList) => {
                        if (newList) {
                            resetFeed()
                            fetchPosts([])
                            return
                        }

                        fetchPosts()
                    }}
                />
            </View>
        </SafeView>
    )
}
