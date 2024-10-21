import { ScrollView, View, TextInput, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import Gallery from 'react-native-awesome-gallery'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import Modal from '../../modals/base'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '../../button'
import { MediaViewer } from '../../modals/mediaViewer'

const charactersLimit = 600

interface Form {
    text: string
    images: ImagePicker.ImagePickerAsset[]
}

export function NewUserPostModal() {
    const { user } = useUserAuthenticated()
    if (!user) return null

    const { pictureUrl } = user

    const { register, control, watch, getValues, setValue } = useForm<Form>({
        defaultValues: {
            text: '',
            images: [],
        },
    })

    const images = watch('images')

    const pickImages = async () => {
        if (images.length >= 10) {
            Alert.alert('Limite de imagens', 'Você atingiu o limite de 10 imagens por postagem')
            return
        }

        const selectionLimit = 10 - images.length

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsMultipleSelection: true,
            selectionLimit,
        })

        if (!result.canceled && result.assets) {
            setValue('images', [...images, ...result.assets])
        }
    }

    const handlePost = () => {
        console.log(getValues())
    }

    return (
        <Modal isVisible={true} close={() => {}} title="Nova postagem">
            {/* <MediaViewer /> */}
            <SafeAreaView className="flex-1">
                <ScrollView>
                    <View className="p-2 flex-row" style={{ gap: 10 }}>
                        <Image source={pictureUrl} className="h-8 w-8 rounded-full" />
                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="text"
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <TextInput
                                            placeholder="O que deseja compartilhar?"
                                            placeholderTextColor={'#78716c'}
                                            multiline
                                            maxLength={charactersLimit}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                {images.length > 0 && (
                    <View className="h-32 border-t border-stone-100">
                        <ScrollView horizontal contentContainerStyle={{ gap: 10, padding: 10 }} showsHorizontalScrollIndicator={false}>
                            {images.map((image, index) => (
                                <View key={`image-${index}`} className="relative">
                                    <TouchableOpacity
                                        className="absolute z-10 right-0 bg-black/80 m-1 rounded-full p-1"
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            // Remove imagem da lista
                                            setValue(
                                                'images',
                                                images.filter((_, i) => i !== index)
                                            )
                                        }}>
                                        <MaterialCommunityIcons name="close" size={14} color="white" />
                                    </TouchableOpacity>
                                    <Image source={{ uri: image.uri }} className="h-full w-28 rounded-md" />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
                <View className="p-2 border-t border-stone-100 flex-row justify-between" style={{ gap: 10 }}>
                    <View className="flex-1 items-center flex-row">
                        <TouchableOpacity className="flex-row items-center" style={{ gap: 4 }} onPress={pickImages}>
                            <MaterialCommunityIcons name="image-outline" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Button text="Publicar" size="sm" variant="outline" onPress={handlePost} />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
