import { SafeAreaView, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Modal from '../../modals/base'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useUser } from '../../../hooks/user'
import { TextInput } from '../../form'
import { Image } from 'expo-image'
import { Button } from '../../button'
import { apiUpdatePictureProfile } from '../../../api/user/updatePictureProfile'
import { handleErrorWithAlert } from '../../../functions/handleError'
import { apiUpdateProfileInformations } from '../../../api/user/updateProfileInformations'
import { placeholderImage } from '../../../functions/placeholderImage'

interface Form {
    name: string
    displayName: string
    biography: string
    imageUrl: string
    imageName?: string
    imageMimeType?: string
}

interface Params {
    onClose: () => void
    editing: boolean
}

export function ModalEditProfile({ onClose, editing }: Params) {
    const userHook = useUser()
    if (!userHook) return null

    const { user } = userHook

    const [loading, setLoading] = useState(false)

    const { setValue, getValues, control, watch } = useForm<Form>()

    const watchPictureUrl = watch('imageUrl')

    useEffect(() => {
        initForm()
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
        })

        if (!result.canceled) {
            const image = result.assets[0]

            setValue('imageUrl', image.uri)
            setValue('imageName', image.fileName ?? image.uri.split('/').pop())
            setValue('imageMimeType', image.mimeType)
        }
    }

    const saveProfile = async () => {
        try {
            setLoading(true)

            const { imageUrl, imageMimeType, imageName, name, displayName, biography } = getValues()

            // Se tiver nome de imagem e porque foi alterado
            if (imageName) {
                await apiUpdatePictureProfile({
                    id: user.id,
                    uri: imageUrl,
                    mimeType: imageMimeType || '',
                })
            }

            await apiUpdateProfileInformations(user.id, {
                biography,
                displayName,
                name,
            })

            onClose()
        } catch (e) {
            handleErrorWithAlert(e)
        } finally {
            setLoading(false)
        }
    }

    const initForm = () => {
        setValue('name', user.name)
        setValue('displayName', user.displayName)
        setValue('biography', user.biography || '')
        setValue('imageUrl', user.pictureUrl)
    }

    return (
        <Modal title="Editar perfil" close={onClose} isVisible={editing}>
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={150}>
                    <ScrollView>
                        <View className="m-4" style={{ gap: 20 }}>
                            <TouchableOpacity onPress={pickImage} className="items-center justify-center" style={{ gap: 10 }}>
                                <Image placeholder={placeholderImage} source={{ uri: watchPictureUrl }} className="h-28 w-28 rounded-full" />
                                <Text>Alterar foto de perfil</Text>
                            </TouchableOpacity>

                            <View style={{ height: 1 }} className="bg-stone-100"></View>

                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { value, onChange } }) => (
                                    <TextInput
                                        title="Nome completo"
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                        textContentType="name"
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="displayName"
                                render={({ field: { value, onChange } }) => (
                                    <TextInput
                                        title="Nome visível"
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                        textContentType="name"
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="biography"
                                render={({ field: { value, onChange } }) => (
                                    <TextInput
                                        title="Biografia"
                                        onChangeText={onChange}
                                        value={value}
                                        textContentType="name"
                                        placeholder="Escreva algo sobre você"
                                    />
                                )}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View className="mx-4">
                    <Button onPress={saveProfile} loading={loading} text="Salvar alterações" />
                </View>
            </SafeAreaView>
        </Modal>
    )
}
