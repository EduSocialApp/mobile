import AsyncStorage from '@react-native-async-storage/async-storage'

export type CacheKey = 'SAW_PRESENTATION' | 'AUTHENTICATED_USER'

interface CacheContent {
    type: string
    value: string | object | number | boolean | undefined
}

export function saveCache(name: CacheKey, value: CacheContent['value']) {
    const cacheContent = {
        type: typeof value,
        value,
    }

    return AsyncStorage.setItem(name, JSON.stringify(cacheContent))
}

export async function readCache(name: CacheKey) {
    const cacheContent = await AsyncStorage.getItem(name)
    if (!cacheContent) return { type: 'undefined', value: undefined }

    return JSON.parse(cacheContent) as CacheContent
}

export function removeCache(name: CacheKey) {
    return AsyncStorage.removeItem(name)
}
