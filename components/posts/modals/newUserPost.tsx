import { ScrollView, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import Modal from '../../modals/base'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '../../button'

const charactersLimit = 600

interface Form {
    text: string
    images?: string[]
}

export function NewUserPostModal() {
    const { user } = useUserAuthenticated()
    if (!user) return null

    const { pictureUrl } = user

    const { register, control, watch } = useForm<Form>()

    return (
        <Modal isVisible={true} close={() => {}} title="Nova postagem">
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
                <View className="p-2 border-t border-stone-100 flex-row justify-between">
                    <View className="flex-1 items-center flex-row">
                        <TouchableOpacity className="flex-row items-center" style={{ gap: 4 }}>
                            <MaterialCommunityIcons name="image-outline" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="border-l border-stone-100 pl-4 ml-4">
                        <Button text="Publicar" size="sm" variant="primary" />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
