import { ScrollView, View, TextInput, SafeAreaView, TouchableOpacity, Alert, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import Modal from '../../modals/base'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../button'
import MediaViewer, { MediaViewerRef } from '../../modals/mediaViewer'
import { handleError } from '../../../functions/handleError'
import { useOrganization } from '../../../hooks/organization'
import { apiNewOrganizationPost } from '../../../api/organization/newOrganizationPost'
import { DateInput } from '../../form'
import { PickAddressModal } from '../../adresses/pickAddress'

const charactersLimit = 600

interface Form {
    text: string
    startDate?: Date
    address?: Address
    endDate?: Date
    images: ImagePicker.ImagePickerAsset[]
}

interface Params {
    visible: boolean
    onClose: (created?: boolean) => void
}

export function NewOrganizationPostModal({ visible, onClose }: Params) {
    const { user } = useUserAuthenticated()
    const org = useOrganization()
    if (!user || !org) return null

    const { control, watch, getValues, setValue, reset } = useForm<Form>({
        defaultValues: {
            text: '',
            images: [],
        },
    })

    const [loading, setLoading] = useState(false)
    const [openStartAndEndDate, setOpenStartAndEndDate] = useState(false)
    const [openPickerAddress, setOpenPickerAddress] = useState(false)

    const images = watch('images')

    const mediaViewerRef = useRef<MediaViewerRef>(null)

    const { pictureUrl: userPictureUrl } = user
    const { pictureUrl: orgPictureUrl, id: organizationId } = org.organization

    useEffect(() => {
        if (visible) {
            reset()
            console.log('AQUI')
        }
    }, [visible])

    const pickImages = async () => {
        if (images.length >= 10) {
            Alert.alert('Limite de imagens', 'Você atingiu o limite de 10 imagens por postagem')
            return
        }

        const selectionLimit = 10 - images.length

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.3,
            allowsMultipleSelection: true,
            selectionLimit,
        })

        if (!result.canceled && result.assets) {
            setValue('images', [...images, ...result.assets])
        }
    }

    const handlePost = async () => {
        try {
            setLoading(true)

            const { images, text } = getValues()

            await apiNewOrganizationPost({
                organizationId,
                content: text,
                images: images.map((image) => ({
                    uri: image.uri,
                    mimeType: image.mimeType || '',
                })),
            })

            onClose(true)
        } catch (e) {
            handleError(e)
        } finally {
            setLoading(false)
        }
    }

    const imagesList = images.map((image) => ({
        uri: image.uri,
    }))

    return (
        <Modal isVisible={visible} close={onClose} title="Nova postagem">
            <MediaViewer ref={mediaViewerRef} imagesList={imagesList} />
            <PickAddressModal
                visible={openPickerAddress}
                onClose={(address) => {
                    setOpenPickerAddress(false)
                    if (address) {
                        setValue('address', address)
                    }
                }}
                organizationId={organizationId}
            />

            <SafeAreaView className="flex-1">
                <ScrollView>
                    <View className="p-2 flex-row" style={{ gap: 2 }}>
                        <View className="flex-row relative items-center">
                            <Image source={userPictureUrl} className="h-8 w-8 rounded-full left-0" />
                            <Image source={orgPictureUrl} className="h-10 w-10 rounded-lg -left-3" />
                        </View>
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
                        <ScrollView horizontal contentContainerStyle={{ gap: 8, padding: 8 }} showsHorizontalScrollIndicator={false}>
                            {images.map((image, index) => (
                                <TouchableOpacity key={`image-${index}`} className="relative" onPress={() => mediaViewerRef.current?.open(index)}>
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
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
                {openStartAndEndDate && (
                    <View className="border-t border-stone-100 flex flex-row items-center p-2" style={{ gap: 8 }}>
                        <View className="flex-1" style={{ gap: 4 }}>
                            <Text>Data de início</Text>
                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field: { value, onChange } }) => {
                                    return <DateInput onChange={onChange} value={value} placeholder="Selecionar..." size="compact" />
                                }}
                            />
                        </View>

                        <View className="flex-1" style={{ gap: 4 }}>
                            <Text>Data de término</Text>
                            <Controller
                                control={control}
                                name="endDate"
                                render={({ field: { value, onChange } }) => {
                                    return <DateInput onChange={onChange} value={value} placeholder="Selecionar..." size="compact" cleanable />
                                }}
                            />
                        </View>
                    </View>
                )}

                <Controller
                    control={control}
                    name="address"
                    render={({ field: { value, onChange } }) => {
                        if (!value) return <></>

                        const { id, street, number, complement, neighborhood, city, state, zipCode, country } = value

                        return (
                            <View className="border-t border-stone-100 p-2 flex-row items-center" style={{ gap: 4 }}>
                                <Text className="flex-1">
                                    {street}, {number}
                                    {complement ? ` - ${complement}` : ''}. {neighborhood}. {city} - {state}, {zipCode}, {country}
                                </Text>
                                <TouchableOpacity>
                                    <MaterialCommunityIcons name="close" size={20} onPress={() => onChange(undefined)} />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />

                <View className="p-2 border-t border-stone-100 flex-row justify-between" style={{ gap: 10 }}>
                    <View className="flex-1 items-center flex-row" style={{ gap: 8 }}>
                        <TouchableOpacity onPress={pickImages}>
                            <MaterialCommunityIcons name="image-outline" size={32} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenStartAndEndDate(!openStartAndEndDate)}>
                            <MaterialCommunityIcons name="calendar-clock-outline" size={32} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenPickerAddress(true)}>
                            <MaterialCommunityIcons name="map-marker-radius-outline" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Button text="Publicar" size="sm" variant="outline" onPress={handlePost} loading={loading} />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
