import * as SecureStore from 'expo-secure-store'

const SESSION_AUTH = 'SessionAuthStorage'   

export function saveSession(accessToken: string, refreshToken: string) {
    const session = JSON.stringify({
        accessToken,
        refreshToken
    })

    return SecureStore.setItemAsync(SESSION_AUTH, session)
}

export function destroySession() {
    return SecureStore.deleteItemAsync(SESSION_AUTH)
}

export function getSession() {
    return SecureStore.getItemAsync(SESSION_AUTH)
}