import { ActivityIndicator, Alert, View, Text } from 'react-native'
import Modal from '../../modals/base'
import { useEffect, useState } from 'react'
import { apiUserLinkShareable } from '../../../api/shareLink/user'
import QRCode from 'react-native-qrcode-svg'

interface Params {
    visible: boolean
    onClose: () => void
}

export function ModalUserQrCode({ visible, onClose }: Params) {
    const [idLink, setIdLink] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (visible) {
            handleUserLink()
        } else {
            setIdLink(undefined)
        }
    }, [visible])

    const handleUserLink = async () => {
        setLoading(true)

        try {
            const { data } = await apiUserLinkShareable()
            setIdLink(data.id)
        } catch {
            Alert.alert('Erro', 'Não foi possível gerar o link de compartilhamento')
            onClose()
        }

        setLoading(false)
    }

    return (
        <Modal isVisible={visible} close={onClose} title="Compartilhar seu perfil">
            {loading && (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            )}
            {!!idLink && (
                <View className="flex-1 items-center justify-center p-5" style={{ gap: 20 }}>
                    <View className="border-2 p-2 rounded-md border-stone-300">
                        <QRCode value={`userLinkId=${idLink}`} size={128} />
                    </View>

                    <Text className="font-bold" style={{ fontSize: 32 }}>
                        {idLink}
                    </Text>

                    <View className="mx-2" style={{ gap: 8 }}>
                        <Text className="text-center">
                            Com este código, você poderá vincular seu perfil a responsáveis legais, como pais ou tutores, e a instituições,
                            facilitando a gestão e o acompanhamento de suas informações.
                        </Text>
                        <Text className="text-stone-500 text-center text-xs">Não compartilhe este código com pessoas desconhecidas</Text>
                    </View>
                </View>
            )}
        </Modal>
    )
}
