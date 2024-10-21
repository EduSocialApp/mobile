import { useCallback, useRef, useState } from 'react'
import { SafeAreaView, TouchableOpacity, View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { TitleBlack } from '../../../components'
import { apiGetHasNewNotifications } from '../../../api/user/hasNewNotifications'
import { NewUserPostModal } from '../../../components/posts/modals/newUserPost'
import { apiGetUserFeed, Post } from '../../../api/user/getUserFeed'

function PostCell({ item: { content, id, likesCount, medias, organization, title, updatedAt, user } }: { item: Post }) {
    const pictureUrl = organization?.pictureUrl || user?.pictureUrl || ''
    const name = organization?.displayName || user?.displayName || ''

    return (
        <View style={{ gap: 8, paddingVertical: 8 }}>
            <View className="flex-row px-2" style={{ gap: 10 }}>
                <Image source={pictureUrl} className="h-12 w-12 rounded-full" />
                <View className="flex-1" style={{ gap: 8 }}>
                    <View>
                        <Text className="font-bold">{name}</Text>
                        <Text>{content}</Text>
                    </View>
                </View>
            </View>

            {medias && medias.length > 0 && (
                <View className="h-32">
                    <ScrollView
                        horizontal
                        className="flex-1"
                        contentContainerStyle={{ gap: 10, paddingLeft: 66, paddingRight: 8 }}
                        showsHorizontalScrollIndicator={false}>
                        {medias.map(({ media: { mediaUrl, description } }, index) => (
                            <TouchableOpacity key={`media-${index}`} className="relative" onPress={() => console.log('open media')}>
                                <Image source={{ uri: mediaUrl }} className="h-full w-28 rounded-md" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View className="flex-row items-center justify-between" style={{ marginLeft: 66 }}>
                <View className="flex-row items-center" style={{ gap: 4 }}>
                    <MaterialCommunityIcons name="heart-outline" size={20} color="black" />
                    {likesCount > 0 && <Text>{likesCount}</Text>}
                </View>
            </View>
        </View>
    )
}

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

    const lastPostId = useRef<string>()
    const isEndReached = useRef(false)

    const resetFeed = () => {
        isEndReached.current = false
        lastPostId.current = undefined
    }

    const handleInit = () => {
        console.log('renderizou')
        apiGetHasNewNotifications()
            .then((res) => {
                setHasNewNotifications(res.data.total > 0)
            })
            .catch(console.log)

        resetFeed()
        fetchPosts([])
    }

    const fetchPosts = async (loadedItems: Post[] = posts) => {
        const result = await apiGetUserFeed({ lastPostId: lastPostId.current })

        lastPostId.current = result.lastPostId

        if (result.itens.length === 1 || result.itens.length === 0) {
            isEndReached.current = true
        }

        setPosts([...loadedItems, ...result.itens])
        setLoading(false)
    }

    const havePosts = posts.length > 0

    return (
        <SafeAreaView className="relative flex-1">
            <NewUserPostModal
                visible={visibleNewPostModal}
                onClose={() => {
                    setVisibleNewPostModal(false)
                }}
            />
            <View className="relative mt-2 h-10 items-center justify-center">
                <TitleBlack />

                <View className="absolute t-0 w-full h-full items-end justify-center">
                    <TouchableOpacity onPress={() => router.push('/authenticated/notifications')} className="px-2 relative">
                        {hasNewNotifications && <View className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full z-10" />}
                        <MaterialCommunityIcons name={'bell-outline'} size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity className="absolute bottom-2 right-2 p-4 bg-headline rounded-full" onPress={() => setVisibleNewPostModal(true)}>
                <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
            </TouchableOpacity>

            <FlashList
                data={posts}
                renderItem={PostCell}
                estimatedItemSize={100}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-200" />}
                onEndReached={fetchPosts}
                onEndReachedThreshold={0.5}
                refreshing={loading && !havePosts}
                onRefresh={() => {
                    resetFeed()
                    fetchPosts([])
                }}
                ListFooterComponent={loading && havePosts ? <ActivityIndicator color="#a5a5a5" /> : null}
            />
        </SafeAreaView>
    )
}
