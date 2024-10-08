import * as SecureStore from 'expo-secure-store'
import { readCache, removeCache, saveCache } from './cache'

const SESSION_AUTH = 'SessionAuthStorage'

/**
 * Salvando as credenciais no SecureStore
 */
export function saveCredentialsInSecureStore(accessToken: string, refreshToken: string, expirationDate: Date) {
    const credentials = JSON.stringify({
        accessToken,
        refreshToken,
        expirationDate,
    })

    return SecureStore.setItemAsync(SESSION_AUTH, credentials)
}

/**
 * Destruindo as credenciais no SecureStore
 */
export function destroyCredentialsInSecureStore() {
    return SecureStore.deleteItemAsync(SESSION_AUTH)
}

/**
 * Pegando as credenciais do SecureStore
 */
export async function getCredentialsFromSecureStore() {
    const credentialsString = await SecureStore.getItemAsync(SESSION_AUTH)

    if (credentialsString) {
        return JSON.parse(credentialsString) as { accessToken: string; refreshToken: string; expirationDate: Date }
    }
}

/**
 * Salva dados do usuário autenticado no cache
 */
export function saveAuthenticatedUser(user: User) {
    return saveCache('AUTHENTICATED_USER', user)
}

/**
 * Pega dados do usuário autenticado no cache
 */
export async function getAuthenticatedUser() {
    const cacheValue = await readCache('AUTHENTICATED_USER')

    if (cacheValue.value) {
        return cacheValue.value as User
    }
}

/**
 * Destroi dados do usuário autenticado no cache
 */
export function destroyAuthenticatedUser() {
    return removeCache('AUTHENTICATED_USER')
}
