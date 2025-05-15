import io, { Socket } from 'socket.io-client'
import { apiUrl } from './url'
import { getCredentialsFromSecureStore } from '../functions/authentication'

let socket: Socket | null = null

// Singleton da conexao com o socket
export async function socketConnect() {
    if (!socket) {
        const credentials = await getCredentialsFromSecureStore()

        console.log('Socket connect', apiUrl, credentials?.accessToken)
        socket = io(apiUrl, {
            transports: ['websocket'],
            auth: {
                token: credentials?.accessToken,
            },
        })
    }

    return socket
}

export function socketDisconnect() {
    if (socket) {
        socket.disconnect()
        socket.removeAllListeners()
    }

    socket = null
}
