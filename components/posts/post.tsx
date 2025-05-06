import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { Post } from '../../api/user/getUserFeed'
import { apiGetPostById } from '../../api/post/getPostById'
import { ImageDisplay } from '../modals/mediaViewer'
import { textTimeSincePost } from '../../functions/textTimeSincePost'

interface Params {
    id: string
}

export function PostPage({ id }: Params) {
    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState<Post | null>(null)

    const debounceGetPost = useRef<NodeJS.Timeout>(undefined)

    useEffect(() => {
        getPost()
    }, [id])

    const getPost = () => {
        setLoading(true)
        clearTimeout(debounceGetPost.current)

        debounceGetPost.current = setTimeout(() => {
            apiGetPostById(id)
                .then(setPost)
                .finally(() => {
                    setLoading(false)
                })
        }, 300)
    }

    if (!post) {
        return <Text>Post não encontrado</Text>
    }

    const pictureUrl = post.organization?.pictureUrl || post.user?.pictureUrl
    const name = post.organization?.displayName || post.user?.displayName
    const profileId = post.organization?.id || post.user?.id
    const verified = post.organization?.verified
    const isOrganization = !!post.organization
    const timeSincePost = textTimeSincePost(post.createdAt)

    const liked = post.likes.length > 0

    const mediasView: ImageDisplay[] = post.medias.map(({ media }) => ({
        uri: media.mediaUrl,
        blurhash: media.blurhash,
    }))

    const onProfileClick = () => {
        if (isOrganization) {
            router.push(`/authenticated/organization/${profileId}`)
            return
        }

        router.push(`/authenticated/profile/${profileId}`)
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row relative items-center h-10 border-b px-2 border-stone-100">
                <TouchableOpacity onPress={() => router.back()} className="z-10">
                    <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="absolute w-full">
                    <Text className="font-bold text-center" style={{ fontSize: 18 }}>
                        Post
                    </Text>
                </View>
            </View>
            <ScrollView className="flex-1">
                <View></View>
                {/* <Text>{JSON.stringify(post)}</Text> */}
            </ScrollView>
        </SafeAreaView>
    )
}
