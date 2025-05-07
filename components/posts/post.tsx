import { Entypo, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import { Post } from '../../api/user/getUserFeed'
import { apiGetPostById } from '../../api/post/getPostById'
import MediaViewer, { ImageDisplay, MediaViewerRef } from '../modals/mediaViewer'
import { textTimeSincePost } from '../../functions/textTimeSincePost'
import { Image } from 'expo-image'
import { cn } from '../../functions/utils'
import { VerifiedBadge } from '../verifiedBadge'
import { placeholderImage } from '../../functions/placeholderImage'
import { LikeButton } from './likeButton'
import { postAddressToString } from '../../functions/postAddressToString'
import { translateMessage } from '../../translate/translateMessage'
import { dateTimeShort } from '../../functions/date/dateFormat'
import { LoadingScreen } from '../loading'
import { DataNotFound } from '../404'

interface Params {
    id: string
}

export function PostPage({ id }: Params) {
    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState<Post | null>(null)
    const [galleryMedias, setGalleryMedias] = useState<ImageDisplay[]>()

    const debounceGetPost = useRef<NodeJS.Timeout>(undefined)
    const mediaViewerRef = useRef<MediaViewerRef>(null)

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

    if (loading) {
        return <LoadingScreen />
    }

    if (!post) {
        return <DataNotFound text="Postagem não encontrada" />
    }

    const pictureUrl = post.organization?.pictureUrl || post.user?.pictureUrl
    const name = post.organization?.displayName || post.user?.displayName
    const profileId = post.organization?.id || post.user?.id
    const verified = post.organization?.verified
    const isOrganization = !!post.organization
    const timeSincePost = textTimeSincePost(post.createdAt)
    const addressString = postAddressToString(post.address)
    const startDateStr = post.startDate ? dateTimeShort(post.startDate) : ''
    const endDateStr = post.endDate ? dateTimeShort(post.endDate) : ''

    const liked = post.likes?.length > 0

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
            <MediaViewer ref={mediaViewerRef} imagesList={galleryMedias} />

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
                {post.level !== 'NORMAL' && (
                    <View className={cn('bg-black p-1', post.level === 'URGENT' && 'bg-red-500', post.level === 'IMPORTANT' && 'bg-primary')}>
                        <Text className={cn('text-white text-center font-semibold', post.level === 'IMPORTANT' && 'text-headline')}>
                            {translateMessage(post.level || '')}
                        </Text>
                    </View>
                )}

                <View className="p-3" style={{ gap: 12 }}>
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity className="flex-row items-center" style={{ gap: 8 }} onPress={onProfileClick}>
                            <Image
                                source={pictureUrl}
                                placeholder={placeholderImage}
                                className={cn('h-12 w-12 rounded-full', isOrganization && 'rounded-lg')}
                            />

                            <View>
                                <View className="flex-row" style={{ gap: 4 }}>
                                    <Text className="font-bold">{name}</Text>
                                    {verified && <VerifiedBadge type="organization" size="xs" />}
                                </View>
                                <Text className="text-stone-500">{timeSincePost}</Text>
                            </View>
                        </TouchableOpacity>
                        <View className="flex-row items-center justify-between mt-1">
                            <LikeButton count={post.likesCount} id={id} liked={liked} />
                        </View>
                    </View>

                    <View style={{ gap: 4 }}>
                        {!!post.title && <Text className="font-bold">{post.title}</Text>}
                        <Text>{post.content}</Text>
                    </View>
                </View>

                {mediasView.length > 0 && (
                    <View className="h-40">
                        <ScrollView
                            horizontal
                            className="flex-1"
                            contentContainerStyle={{ gap: 12, paddingHorizontal: 12 }}
                            showsHorizontalScrollIndicator={false}>
                            {mediasView.map(({ uri, blurhash }, index) => {
                                const placeholder = blurhash ? { blurhash } : placeholderImage

                                return (
                                    <TouchableOpacity
                                        key={`media-${uri}`}
                                        className="relative"
                                        onPress={() => {
                                            setGalleryMedias(mediasView)
                                            mediaViewerRef.current?.open(index || 0)
                                        }}>
                                        <Image source={{ uri }} className="h-full w-40 rounded-md" placeholder={placeholder} />
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                )}

                <View className="p-3" style={{ gap: 12 }}>
                    {!!addressString && (
                        <View className="flex-row items-center" style={{ gap: 8 }}>
                            <Ionicons name="location-outline" size={24} color="black" />
                            <View className="flex-1">
                                <Text>{addressString}</Text>
                            </View>
                        </View>
                    )}

                    {!!startDateStr && (
                        <View className="flex-row items-center" style={{ gap: 8 }}>
                            <Ionicons name="calendar-clear-outline" size={24} color="black" />
                            <View className="flex-1">
                                <Text>
                                    {startDateStr} {endDateStr ? ` - ${endDateStr}` : ''}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
