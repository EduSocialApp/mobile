import AsyncStorage from '@react-native-async-storage/async-storage'

export type CacheKey = 'SAW_PRESENTATION' | 'AUTHENTICATED_USER' | 'CONVERSATION_CONTACT' | 'REGISTER_USER'

interface CacheContent<T = string | object | number | boolean> {
    type: string
    value?: T
}

export function saveCache<T>(name: CacheKey, value: CacheContent<T>['value']) {
    const cacheContent = {
        type: typeof value,
        value,
    }

    return AsyncStorage.setItem(name, JSON.stringify(cacheContent))
}

export async function readCache<T>(name: CacheKey) {
    const cacheContent = await AsyncStorage.getItem(name)
    if (!cacheContent) return { type: 'undefined', value: undefined }

    return JSON.parse(cacheContent) as CacheContent<T>
}

export function removeCache(name: CacheKey) {
    return AsyncStorage.removeItem(name)
}
