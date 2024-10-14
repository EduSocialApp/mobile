import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { Alert, View, Text, ActivityIndicator } from 'react-native'
import Modal from './base'
import React, { useEffect, useState } from 'react'
import { Button } from '../button'

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
            <View className="flex-1" style={{ gap: 20 }}>
                <View className="mt-5">
                    <Text className="text-center text-base">{description}</Text>
                </View>
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
            </View>
        </Modal>
    )
}
