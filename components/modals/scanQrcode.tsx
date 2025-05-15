import { CameraView, useCameraPermissions } from 'expo-camera'
import { View, Text, ActivityIndicator } from 'react-native'
import Modal from './base'
import { Button } from '../button'
import SafeView from '../safeView'

interface Params {
    visible: boolean
    onClose: () => void
    description?: string
    onScan: (id: string) => void
}

// permission && !permission.granted

export function ScanQrCode({ visible, description = 'Escaneie o QR', onClose, onScan }: Params) {
    const [permission, requestPermission] = useCameraPermissions()

    return (
        <Modal isVisible={visible} close={onClose} title="Escanear QR code">
            <SafeView style={{ gap: 20 }}>
                {visible && (
                    <View className="flex-1">
                        {!permission && <ActivityIndicator size="large" />}
                        {permission && !permission.granted && (
                            <View className="p-4 rounded-xl bg-secondary" style={{ gap: 10 }}>
                                <Text className="text-center text-lg text-headline">Precisamos da sua permissão para exibir a câmera</Text>
                                <Button onPress={requestPermission} text="Permitir" />
                            </View>
                        )}
                        {permission && permission.granted && (
                            <CameraView
                                facing="back"
                                className="flex-1"
                                barcodeScannerSettings={{
                                    barcodeTypes: ['qr'],
                                }}
                                onBarcodeScanned={({ data }) => {
                                    onScan(data)
                                }}></CameraView>
                        )}
                    </View>
                )}
                <View>
                    <Text className="text-center text-base m-2 p-2">{description}</Text>
                </View>
            </SafeView>
        </Modal>
    )
}
