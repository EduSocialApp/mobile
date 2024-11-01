import { View, Text, TouchableOpacity } from 'react-native'
import { Post } from '../../../api/user/getUserFeed'
import { ListPosts } from '../../posts/ListPosts'
import { useCallback, useRef, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { apiGetOrganizationPosts } from '../../../api/organization/getOrganizationPosts'
import debounce from 'lodash/debounce'
import { useOrganization } from '../../../hooks/organization'

export function OrganizationPosts() {
    const org = useOrganization()
    if (!org) return null

    const [loading, setLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<Post[]>([])

    const lastPostId = useRef<string>()
    const isEndReached = useRef(false)

    const { id } = org.organization

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
            const result = await apiGetOrganizationPosts({ id, lastPostId: lastPostId.current })

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
