import { Modal, Text, View, TouchableOpacity } from 'react-native'
import { Button } from '../button'
import { Image } from 'expo-image'
import { LinkSupervisedUser } from '../../api/user/supervised/getSupervisedUsers'
import { router } from 'expo-router'
import { dateShort } from '../../functions/date/dateFormat'
import { placeholderImage } from '../../functions/placeholderImage'

interface Params {
    member?: LinkSupervisedUser
    close: () => void
    onConfirmEvent: (eventCode: string) => void
}

export function FamilyMemberOptions({ member, close, onConfirmEvent }: Params) {
    const MenuRender = () => {
        if (!member) return null

        const {
            supervisedUser: { id, pictureUrl, displayName },
            updatedAt,
        } = member

        const updatedAtFormatted = dateShort(updatedAt)

        return (
            <View style={{ gap: 14 }}>
                <View className="items-center justify-center" style={{ gap: 10 }}>
                    <Image source={{ uri: pictureUrl }} placeholder={placeholderImage} className="h-14 w-14 rounded-full" />
                    <View className="items-center">
                        <Text className="font-bold texxt-center">{displayName}</Text>
                        <Text className="text-center text-stone-400">Membro desde {updatedAtFormatted}</Text>
                    </View>
                </View>
                <View>
                    <Button
                        onPress={() => {
                            router.push(`/authenticated/profile/${id}`)
                            close()
                        }}
                        variant="white"
                        text="Ver perfil"
                    />
                    <Button onPress={() => onConfirmEvent('removeLink')} variant="white">
                        <Text className="text-red-600 font-bold">Remover da família</Text>
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <Modal visible={Boolean(member)} animationType="slide" transparent>
            <View className="flex-1 relative justify-end">
                <TouchableOpacity className="flex-1 bg-black/70" onPress={close} activeOpacity={1}></TouchableOpacity>
                <View className="py-10 px-4 absolute w-full" style={{ gap: 30 }}>
                    <View className="bg-white rounded-lg p-4">
                        <MenuRender />
                    </View>

                    <Button onPress={close} text="Cancelar" variant="white" />
                </View>
            </View>
        </Modal>
    )
}
