import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'

export enum MessageStatus {
    Default = '0',
    Success = '1',
    Error = '2',
    Loading = '3'
}

export interface IMessage {
    isVisible: boolean
    onClose: () => void
    onVisible: () => void
}

export interface IMessageRef {
    updateMessage: (message: string, status?: MessageStatus, duration?: number) => void
}

const Message = forwardRef<IMessageRef, IMessage>(({ isVisible, onClose, onVisible }, ref) => {
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<MessageStatus>()
    const [timeoutDuration, setTimeoutDuration] = useState<number>()

    useImperativeHandle(ref, () => ({
        updateMessage
    }))

    const updateMessage = (message: string, status: MessageStatus = MessageStatus.Default, duration: number = 0) => {
        onVisible()
        clearTimeout(timeoutDuration)

        setMessage(message)
        setStatus(status)

        if (duration > 0) {
            setTimeoutDuration(setTimeout(() => {
                onClose()
                setMessage('')
                setStatus(MessageStatus.Default)
            }, duration))
        }
    }

    return (
        <Modal animationType='fade' transparent={true} visible={isVisible} onRequestClose={onClose}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.9} style={{ backgroundColor: '#1818189d', height: '100%', width: '100%', position: 'absolute' }} />
            <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}>
                    <Text>{message}</Text>

                    {
                        (!timeoutDuration || timeoutDuration === 0) &&
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
                            <TouchableOpacity style={{ backgroundColor: '#e2e2e2', padding: 10, paddingHorizontal: 20, borderRadius: 10 }} onPress={onClose}>
                                <Text>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    )
})

export default Message