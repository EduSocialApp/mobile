import { Text, View, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { SettingContainer } from '../../../components/settingContainer'
import imgFamily from '../../../assets/others/elephant family-rafiki.png'
import { router } from 'expo-router'
import { ScanQrCode } from '../../../components/modals/scanQrcode'
import { useState } from 'react'

export default function Family() {
    const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false)

    return (
        <View className="flex-1 bg-stone-100">
            <ScanQrCode
                onClose={() => setOpenQrCodeScanner(false)}
                onScan={(data) => {
                    setOpenQrCodeScanner(false)
                    alert(data)
                }}
                visible={openQrCodeScanner}
                description='Peça para o usuário mostrar o QR code de compartilhamento, que ele pode encontrar no perfil ao clicar em "Compartilhar"'
            />

            <Header title="Família" backButton />

            <ScrollView contentContainerStyle={{ paddingVertical: 20, gap: 10 }}>
                <SettingContainer>
                    <View style={{ maxHeight: 200 }}>
                        <Image source={imgFamily} className="h-full w-full" contentFit="contain" />
                    </View>
                    <Text className="text-center">Você pode se conectar com seus filhos, netos ou com aqueles de quem você cuida</Text>
                    <Button text="Conectar" onPress={() => setOpenQrCodeScanner(true)} />
                </SettingContainer>
            </ScrollView>
        </View>
    )
}
