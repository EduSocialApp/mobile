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
import { handleError, handleErrorWithAlert } from '../../../functions/handleError'
import { useOrganization } from '../../../hooks/organization'
import { apiNewOrganizationPost } from '../../../api/organization/newOrganizationPost'
import { DateInput } from '../../form'
import { PickAddressModal } from '../../adresses/pickAddress'

const charactersLimit = 600

interface Form {
    text: string
    title: string
    startDate?: Date | null
    address?: Address | null
    endDate?: Date | null
    images: ImagePicker.ImagePickerAsset[]
    level: PostLevel
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
            title: '',
            level: 'NORMAL',
            images: [],
        },
    })

    const [loading, setLoading] = useState(false)
    const [openStartAndEndDate, setOpenStartAndEndDate] = useState(false)
    const [openPickerAddress, setOpenPickerAddress] = useState(false)

    const images = watch('images')
    const address = watch('address')

    const mediaViewerRef = useRef<MediaViewerRef>(null)

    const { pictureUrl: userPictureUrl } = user
    const { pictureUrl: orgPictureUrl, id: organizationId } = org.organization

    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])

    const pickImages = async () => {
        if (images.length >= 10) {
            Alert.alert('Limite de imagens', 'Você atingiu o limite de 10 imagens por postagem')
            return
        }

        const selectionLimit = 10 - images.length

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
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

            const { images, text, level, address, endDate, startDate, title } = getValues()

            await apiNewOrganizationPost({
                organizationId,
                content: text,
                images: images.map((image) => ({
                    uri: image.uri,
                    mimeType: image.mimeType || '',
                })),
                level,
                title,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                addressId: address ? address.id : undefined,
            })

            onClose(true)
        } catch (e) {
            handleErrorWithAlert(e)
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
                    <View className="p-2 flex-row items-start" style={{ gap: 2 }}>
                        <View className="flex-row relative items-center">
                            <Image source={userPictureUrl} className="h-8 w-8 rounded-full left-0" />
                            <Image source={orgPictureUrl} className="h-10 w-10 rounded-lg -left-3" />
                        </View>
                        <View className="flex-1 h-full">
                            <Controller
                                control={control}
                                name="title"
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <TextInput
                                            placeholder="Título (opcional)"
                                            placeholderTextColor={'#78716c'}
                                            value={value}
                                            onChangeText={onChange}
                                            className="font-bold border-b border-stone-100 pb-1"
                                        />
                                    )
                                }}
                            />
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
                            <Text>Início do evento</Text>
                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field: { value, onChange } }) => {
                                    return <DateInput onChange={onChange} value={value} placeholder="Selecionar..." size="compact" mode="datetime" />
                                }}
                            />
                        </View>

                        <View className="flex-1" style={{ gap: 4 }}>
                            <Text>Término do evento</Text>
                            <Controller
                                control={control}
                                name="endDate"
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <DateInput
                                            onChange={onChange}
                                            value={value}
                                            placeholder="Selecionar..."
                                            size="compact"
                                            cleanable
                                            mode="datetime"
                                        />
                                    )
                                }}
                            />
                        </View>
                    </View>
                )}

                {address && (
                    <View className="border-t border-stone-100 p-2 flex-row items-center" style={{ gap: 4 }}>
                        <Text className="flex-1">
                            {address.street}, {address.number}
                            {address.complement ? ` - ${address.complement}` : ''}. {address.neighborhood}. {address.city} - {address.state},{' '}
                            {address.zipCode}, {address.country}
                        </Text>
                        <TouchableOpacity onPress={() => setValue('address', null)}>
                            <MaterialCommunityIcons name="close" size={20} />
                        </TouchableOpacity>
                    </View>
                )}

                <View className="p-2 border-t border-stone-100 flex-row justify-between" style={{ gap: 8 }}>
                    <View className="flex-1 items-center flex-row" style={{ gap: 14 }}>
                        <TouchableOpacity onPress={pickImages}>
                            <MaterialCommunityIcons name="image-outline" size={32} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenStartAndEndDate(!openStartAndEndDate)}>
                            <MaterialCommunityIcons name="calendar-clock-outline" size={32} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenPickerAddress(true)}>
                            <MaterialCommunityIcons name="map-marker-radius-outline" size={32} color="black" />
                        </TouchableOpacity>
                        <Controller
                            control={control}
                            name="level"
                            render={({ field: { value, onChange } }) => {
                                const [bgColor, text, nextState] = {
                                    NORMAL: ['#009013', 'Normal', 'IMPORTANT'],
                                    IMPORTANT: ['#f59e0b', 'Importante', 'URGENT'],
                                    URGENT: ['#dc2626', 'Urgente', 'NORMAL'],
                                }[value] as [string, string, PostLevel]

                                return (
                                    <TouchableOpacity
                                        className="flex-row items-center"
                                        style={{ gap: 4 }}
                                        onPress={() => setValue('level', nextState)}>
                                        <MaterialCommunityIcons name="circle" size={12} color={bgColor} />
                                        <Text>{text}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                    <View>
                        <Button text="Publicar" size="sm" variant="outline" onPress={handlePost} loading={loading} />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
