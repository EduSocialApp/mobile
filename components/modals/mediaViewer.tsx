import { StatusBar } from 'expo-status-bar'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Gallery, { GalleryRef, RenderItemInfo } from 'react-native-awesome-gallery'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { placeholderImage } from '../../functions/placeholderImage'

export interface ImageDisplay {
    uri: string
    blurhash?: string
}

interface Params {
    loop?: boolean
    imagesList?: ImageDisplay[]
    onClose?: () => void
    initialIndex?: number
}

export interface MediaViewerRef {
    open: (mediaIndex: number) => void
    close: () => void
}

function RenderImage({ item: { uri, blurhash }, setImageDimensions }: RenderItemInfo<ImageDisplay>) {
    const placeholder = blurhash ? { blurhash } : placeholderImage

    return (
        <Image
            key={`gallery-${uri}`}
            source={uri}
            style={StyleSheet.absoluteFillObject}
            placeholder={placeholder}
            contentFit="contain"
            onLoad={(e) => {
                const { width, height } = e.source
                setImageDimensions({ width, height })
            }}
        />
    )
}

function MediaViewer({ loop = true, initialIndex = 0, imagesList = [], onClose }: Params, ref: ForwardedRef<MediaViewerRef>) {
    const [visible, setVisible] = useState(false)
    const [index, setIndex] = useState(initialIndex)

    const gallery = useRef<GalleryRef>(null)

    useImperativeHandle(ref, () => ({
        open,
        close,
    }))

    const open = (mediaIndex: number = 0) => {
        setIndex(mediaIndex)
        setVisible(true)
    }

    const close = () => {
        setVisible(false)
        if (onClose) onClose()
    }

    const totalImages = imagesList.length

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <StatusBar style="light" />
            <View className="flex-1 relative">
                {totalImages > 1 && (
                    <View className="absolute top-20 z-10 w-full">
                        <Text className="text-white text-center font-bold">
                            {index + 1} de {totalImages}
                        </Text>
                    </View>
                )}
                <View className="absolute top-20 z-10 right-2">
                    <TouchableOpacity onPress={close}>
                        <MaterialCommunityIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Gallery
                    ref={gallery}
                    keyExtractor={(item) => item.uri}
                    loop={loop}
                    data={imagesList}
                    renderItem={RenderImage}
                    onIndexChange={setIndex}
                    onSwipeToClose={close}
                    initialIndex={index}
                />
            </View>
        </Modal>
    )
}

export default forwardRef(MediaViewer)
