import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'

/**
 * Retorna o token do dispositivo para identificar e receber notificacoes
 */
export async function notificationDevice(): Promise<{ notificationToken: string; deviceName: string }> {
    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus // Verifica permissao atual

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status // Status depois de perguntar para o usuario se concede a permissao
            }

            if (finalStatus !== 'granted') throw new Error('Permissao de notificacao nao concedida')

            const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId || ''
            const notificationToken = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data
            const deviceName = `${Device.osName}/${Device.osVersion} - ${Device.deviceType} - ${Device.manufacturer} - ${Device.modelId || 'M'}/${
                Device.modelName
            }`

            return { notificationToken, deviceName }
        }
    } catch (e) {
        // Se der erro nao faz nada
        console.log('Erro ao pegar token de notificacao!', e)
    }

    return {
        notificationToken: '',
        deviceName: '',
    }
}
