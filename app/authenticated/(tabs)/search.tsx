import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { TextInput } from '../../../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { apiFindAll, FindItem } from '../../../api/find/get'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { VerifiedBadge } from '../../../components/verifiedBadge'
import { UserView } from '../../../components/userView'
import { placeholderImage } from '../../../functions/placeholderImage'
import SafeView from '../../../components/safeView'

function ContentCell({ item: { title, type, id, info, urlPicture, verified } }: { item: FindItem }) {
    if (type === 'ORG') {
        return (
            <TouchableOpacity className="p-2" onPress={() => router.push('/authenticated/organization/' + id)}>
                <View className="flex-row items-center">
                    <Image source={{ uri: urlPicture }} placeholder={placeholderImage} className="h-10 w-10 rounded-lg" />
                    <View className="flex-1 ml-2">
                        <View className="flex-row flex-1 items-center" style={{ gap: 4 }}>
                            <Text className="font-semibold" numberOfLines={1} style={{ fontSize: 16 }}>
                                {title}
                            </Text>
                            {verified && <VerifiedBadge type="organization" />}
                        </View>
                        {!!info && (
                            <Text numberOfLines={1} className="text-stone-500">
                                {info}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity className="p-2" onPress={() => router.push('/authenticated/profile/' + id)}>
            <UserView title={title} urlPicture={urlPicture} info={info} />
        </TouchableOpacity>
    )
}

export default function Search() {
    const [search, setSearch] = useState('')
    const [content, setContent] = useState<FindItem[]>([])
    const [loading, setLoading] = useState(true)

    const lastOrgId = useRef<string>(undefined)
    const lastUserId = useRef<string>(undefined)
    const isEndReached = useRef(false)
    const debounceTime = useRef<NodeJS.Timeout>(undefined)

    useEffect(() => {
        lastOrgId.current = undefined
        lastUserId.current = undefined
        isEndReached.current = false

        handleSearch(search ? 1000 : 100, []) // 1s se tiver texto, 100ms se não tiver
    }, [search])

    const handleSearch = (waitTime = 1000, loadedItems = content) => {
        if (isEndReached.current) return // Se já chegou no final, não busca mais

        setLoading(true)

        clearTimeout(debounceTime.current)
        debounceTime.current = setTimeout(() => fetchSearch(loadedItems), waitTime)
    }

    const fetchSearch = async (loadedItems: FindItem[] = []) => {
        const result = await apiFindAll({
            query: search,
            cursor: {
                userId: lastUserId.current,
                organizationId: lastOrgId.current,
            },
        })

        lastUserId.current = result.lastUserId
        lastOrgId.current = result.lastOrganizationId

        if (result.itens.length === 1 || result.itens.length === 0) {
            isEndReached.current = true
        }

        setContent([...loadedItems, ...result.itens])
        setLoading(false)
    }

    const Header = !search ? (
        <View className="m-2 my-4">
            <Text className="text-lg font-bold">Contas sugeridas</Text>
            <Text>Siga mais perfis que combinam com seus interesses e faça sua rede crescer!</Text>
        </View>
    ) : null

    return (
        <SafeView className="bg-white flex-1" edges={['top']}>
            <View className="p-2 border-b border-stone-100">
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar"
                    keyboardType="web-search"
                    textContentType="nickname"
                    size="sm"
                    PrefixChild={<MaterialCommunityIcons name="magnify" size={20} color="#999999" />}
                    SuffixChild={
                        !!search && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <MaterialCommunityIcons name="close" size={20} />
                            </TouchableOpacity>
                        )
                    }
                />
            </View>
            <FlashList
                data={content}
                renderItem={ContentCell}
                ListHeaderComponent={Header}
                estimatedItemSize={100}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
                onEndReached={() => handleSearch(100)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator color="#a5a5a5" /> : null}
            />
        </SafeView>
    )
}
