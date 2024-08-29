import AsyncStorage from '@react-native-async-storage/async-storage'
import { IRegisterUser } from '../types'

const REGISTER_CACHE = 'SessionRegisterCache'

export function saveRegisterCache(user: IRegisterUser) {
    return AsyncStorage.setItem(REGISTER_CACHE, JSON.stringify(user))
}

export async function getRegisterCache() {
    const user = await AsyncStorage.getItem(REGISTER_CACHE)
    
    if (user) {
        return JSON.parse(user) as IRegisterUser
    }

    return null
}

export function destroyRegisterCache() {
    return AsyncStorage.removeItem(REGISTER_CACHE)
}