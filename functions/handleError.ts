import { AxiosError } from 'axios'
import { translateMessage } from '../translate/translateMessage'
import { Alert } from 'react-native'

export function handleError(error: unknown) {
    if (error instanceof AxiosError) {
        return translateMessage(error.response?.data?.message)
    }

    return translateMessage('Internal error')
}

export function handleErrorWithAlert(error: unknown) {
    Alert.alert('Erro', handleError(error))
}
