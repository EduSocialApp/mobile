import { StatusBar } from 'expo-status-bar'
import { useRef } from 'react'
import { Modal, View, SafeAreaView, Text } from 'react-native'
import Gallery, { GalleryRef } from 'react-native-awesome-gallery'

const imagesList = ['https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp']

interface Params {
    loop?: boolean
}

export function MediaViewer({ loop = true }: Params) {
    const gallery = useRef<GalleryRef>(null)

    return (
        <Modal visible={true} animationType="fade" transparent>
            <StatusBar style="light" />
            <View className="flex-1">
                <Gallery
                    ref={gallery}
                    loop={loop}
                    data={imagesList}
                    onIndexChange={(newIndex) => {
                        console.log(newIndex)
                    }}
                />
            </View>
        </Modal>
    )
}
