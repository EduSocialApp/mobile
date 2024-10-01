import { Modal, View, Text, ActivityIndicator } from 'react-native'

interface Params {
    open: boolean
    text?: string
}

export function ModalLoading({ open, text = 'Carregando..' }: Params) {
    return (
        <Modal visible={open} animationType="fade" transparent>
            <View className="bg-black/80 flex-1 items-center justify-center p-5">
                <View className="bg-white p-5 rounded-lg items-center justify-center" style={{ minWidth: 180, minHeight: 180, gap: 28 }}>
                    <ActivityIndicator size="large" />
                    <Text className="text-center text-stone-600">{text}</Text>
                </View>
            </View>
        </Modal>
    )
}
