import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import { Post as IPost } from '../../api/user/getUserFeed'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import MediaViewer, { ImageDisplay, MediaViewerRef } from '../modals/mediaViewer'
import { placeholderImage } from '../../functions/placeholderImage'
import { dateDiff } from '../../functions/date/dateDiff'
import { dateShort } from '../../functions/date/dateFormat'
import { cn } from '../../functions/utils'
import { apiLikeOrUnlikePost } from '../../api/post/likePost'
import { useHeaderOptions } from '../../hooks/headerOptions'
import { EmptyList } from '../emptyList'
import { VerifiedBadge } from '../verifiedBadge'

interface Params {
    posts?: IPost[]
    loading?: boolean
    onRefresh?: (newList?: boolean) => void
}

interface PostParams {
    id: string
    profileId: string
    name?: string
    pictureUrl?: string
    content?: string
    likesCount?: number
    medias?: ImageDisplay[]
    dateStr?: string
    verified?: boolean
    isOrganization?: boolean
    liked?: boolean
    onMediaClick?: (uris: ImageDisplay[], index?: number) => void
}

function textTimeSincePost(dateStr: string) {
    const { days, hours, minutes, seconds } = dateDiff(dateStr, new Date().toISOString())

    if (days > 3) return dateShort(dateStr)
    if (days > 0) return `${Math.round(days)}d`
    if (hours > 0) return `${Math.round(hours)}h`
    if (minutes > 0) return `${Math.round(minutes)}m`
    return `${Math.round(seconds)}s`
}

// https://shopify.github.io/flash-list/docs/recycling/
function LikeButton({ count, id, liked }: { count: number; id: string; liked: boolean }) {
    const lastItemId = useRef(id)
    const [likedState, setLikedState] = useState(liked)

    if (id !== lastItemId.current) {
        lastItemId.current = id
        setLikedState(liked)
    }

    let likesCount = count

    if (likedState !== liked) {
        likesCount = likedState ? likesCount + 1 : likesCount - 1
    }

    return (
        <TouchableOpacity
            className="flex-row items-center"
            style={{ gap: 4 }}
            onPress={() => {
                apiLikeOrUnlikePost(id)
                const newLikeState = !likedState
                setLikedState(newLikeState)
                Haptics.impactAsync(newLikeState ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light)
            }}>
            {!likedState && <MaterialCommunityIcons name="heart-outline" size={22} color="black" />}
            {likedState && <MaterialCommunityIcons name="heart" size={22} color="red" />}
            {likesCount > 0 && <Text className={cn('text-stone-500', likedState && 'text-red-500')}>{likesCount}</Text>}
        </TouchableOpacity>
    )
}

function Post({
    id,
    profileId,
    name = '',
    pictureUrl = '',
    content = '',
    likesCount = 0,
    medias = [],
    dateStr = '',
    liked = false,
    onMediaClick = () => {},
    verified = false,
    isOrganization = false,
}: PostParams) {
    const onProfileClick = () => {
        if (isOrganization) {
            router.push(`/authenticated/organization/${profileId}`)
            return
        }

        router.push(`/authenticated/profile/${profileId}`)
    }

    const timeSincePost = textTimeSincePost(dateStr)

    return (
        <View>
            <View className="flex-row p-2" style={{ gap: 8 }}>
                <TouchableOpacity onPress={onProfileClick}>
                    <Image
                        source={pictureUrl}
                        placeholder={placeholderImage}
                        className={cn('h-12 w-12 rounded-full', isOrganization && 'rounded-lg')}
                    />
                </TouchableOpacity>
                <View className="flex-1" style={{ gap: 4 }}>
                    <TouchableOpacity onPress={onProfileClick} className="flex-row" style={{ gap: 4 }}>
                        <View className="flex-row" style={{ gap: 4 }}>
                            <Text className="font-bold">{name}</Text>
                            {verified && <VerifiedBadge type="organization" size="xs" />}
                        </View>
                        <Text className="text-stone-500">•</Text>
                        <Text className="text-stone-500">{timeSincePost}</Text>
                    </TouchableOpacity>

                    <Text>{content}</Text>

                    {medias.length > 0 && (
                        <View className="h-32 mt-1">
                            <ScrollView
                                horizontal
                                className="flex-1"
                                contentContainerStyle={{ gap: 10, paddingRight: 8 }}
                                showsHorizontalScrollIndicator={false}>
                                {medias.map(({ uri, blurhash }, index) => {
                                    const placeholder = blurhash ? { blurhash } : placeholderImage

                                    return (
                                        <TouchableOpacity key={`media-${uri}`} className="relative" onPress={() => onMediaClick(medias, index)}>
                                            <Image source={{ uri }} className="h-full w-28 rounded-md" placeholder={placeholder} />
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    )}

                    <View className="flex-row items-center justify-between mt-1">
                        <LikeButton count={likesCount} id={id} liked={liked} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export function ListPosts({ posts = [], loading = false, onRefresh = () => {} }: Params) {
    const { setHeaderHeight, headerHeight } = useHeaderOptions()

    const [galleryMedias, setGalleryMedias] = useState<ImageDisplay[]>()

    const mediaViewerRef = useRef<MediaViewerRef>(null)

    const PostCell = ({ item: { content, id, likesCount, medias, organization, createdAt, updatedAt, user, likes } }: { item: IPost }) => {
        const pictureUrl = organization?.pictureUrl || user?.pictureUrl
        const name = organization?.displayName || user?.displayName
        const profileId = organization?.id || user?.id
        const verified = organization?.verified

        const liked = likes.length > 0

        const mediasView: ImageDisplay[] = medias.map(({ media }) => ({
            uri: media.mediaUrl,
            blurhash: media.blurhash,
        }))

        if (!profileId) return null

        return (
            <Post
                id={id}
                profileId={profileId}
                name={name}
                pictureUrl={pictureUrl}
                likesCount={likesCount}
                medias={mediasView}
                content={content}
                dateStr={createdAt}
                isOrganization={!!organization}
                liked={liked}
                verified={verified}
                onMediaClick={(uris, index) => {
                    setGalleryMedias(uris)
                    mediaViewerRef.current?.open(index || 0)
                }}
            />
        )
    }

    const havePosts = posts.length > 0

    return (
        <View className="flex-1">
            <MediaViewer ref={mediaViewerRef} imagesList={galleryMedias} />
            <FlashList
                renderItem={PostCell}
                data={posts}
                estimatedItemSize={100}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
                onEndReached={onRefresh}
                onEndReachedThreshold={0.5}
                refreshing={loading && !havePosts}
                onRefresh={() => onRefresh(true)}
                onScroll={({
                    nativeEvent: {
                        contentOffset: { y },
                    },
                }) => {
                    setHeaderHeight(y - 300)
                }}
                scrollEventThrottle={16}
                ListFooterComponent={loading && havePosts ? <ActivityIndicator color="#a5a5a5" /> : null}
                ListEmptyComponent={!loading ? () => <EmptyList title="Nenhuma postagem" subtitle="Este perfil ainda não compartilhou nada" /> : null}
            />
        </View>
    )
}
