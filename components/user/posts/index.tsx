import { View, Text } from 'react-native'
import { useUser } from '../../../hooks/user'
import { useCallback, useRef, useState } from 'react'
import { Post } from '../../../api/user/getUserFeed'
import { useFocusEffect } from 'expo-router'
import { debounce } from 'lodash'
import { apiGetUserPosts } from '../../../api/user/getUserPosts'
import { ListPosts } from '../../posts/ListPosts'

export function ProfilePosts() {
    const userHook = useUser()
    if (!userHook) return null

    const {
        user: { id },
    } = userHook

    const [loading, setLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<Post[]>([])

    const lastPostId = useRef<string>(undefined)
    const isEndReached = useRef(false)

    // Executa a função fetchOrganizations sempre que a tela é focada
    useFocusEffect(
        useCallback(() => {
            resetPosts()

            return () => {}
        }, [])
    )

    const resetPosts = () => {
        isEndReached.current = false
        lastPostId.current = undefined
        debouncedFetchPosts([])
    }

    const fetchPosts = async (loadedItems: Post[] = posts) => {
        setLoading(true)
        try {
            const result = await apiGetUserPosts({ id, lastPostId: lastPostId.current })

            lastPostId.current = result.lastPostId

            if (result.itens.length === 1 || result.itens.length === 0) {
                isEndReached.current = true
            }

            setPosts([...loadedItems, ...result.itens])
        } catch (error) {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedFetchPosts = debounce(fetchPosts, 100)

    return (
        <View className="flex-1 bg-white">
            <ListPosts
                posts={posts}
                loading={loading}
                onRefresh={(newList) => {
                    if (newList) {
                        resetPosts()
                        return
                    }

                    debouncedFetchPosts()
                }}
            />
        </View>
    )
}
