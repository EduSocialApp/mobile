import { useRef, useState } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { apiLikeOrUnlikePost } from '../../api/post/likePost'
import * as Haptics from 'expo-haptics'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { cn } from '../../functions/utils'

// https://shopify.github.io/flash-list/docs/recycling/
export function LikeButton({ count, id, liked }: { count: number; id: string; liked: boolean }) {
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
