import { Modal, Text, View } from 'react-native'
import { Button } from '../../button'
import { OrganizationMember } from '../../../api/organization/members'
import { Image } from 'expo-image'
import { Badge } from '../../badge'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { useOrganization } from '../../../hooks/organization'
import { placeholderImage } from '../../../functions/placeholderImage'

interface Params {
    member?: OrganizationMember
    close: () => void
    onConfirmEvent: () => void
}

export function MemberOptions({ member, close, onConfirmEvent }: Params) {
    const user = useUserAuthenticated()
    const org = useOrganization()
    if (!org) return null

    const MenuRender = () => {
        if (!member) return null

        const {
            user: { displayName, pictureUrl },
            role,
        } = member

        return (
            <View style={{ gap: 14 }}>
                <View className="items-center justify-center" style={{ gap: 10 }}>
                    <Image source={{ uri: pictureUrl }} placeholder={placeholderImage} className="h-14 w-14 rounded-full" />
                    <Text className="font-bold">{displayName}</Text>
                    {role === 'MODERATOR' && <Badge title="Moderador" />}
                    {role === 'OWNER' && <Badge title="Responsável" variant="danger" />}
                </View>
                <View>
                    {(user.isModerator || org.isMemberModerator) && role !== 'OWNER' && (
                        <Button onPress={() => {}} variant="white">
                            <Text className="text-red-600 font-bold">Remover</Text>
                        </Button>
                    )}
                    {(user.isAdmin || user.isModerator || org.isOwner) && role !== 'MODERATOR' && role !== 'OWNER' && (
                        <Button onPress={() => {}} text="Promover a moderador" variant="white" />
                    )}
                    {(user.isAdmin || org.isOwner) && role !== 'OWNER' && (
                        <Button onPress={() => {}} text="Promover a responsável" variant="white">
                            <Text className="text-orange-600 font-bold">Promover a responsável</Text>
                        </Button>
                    )}
                </View>
            </View>
        )
    }

    return (
        <Modal visible={Boolean(member)} animationType="slide" transparent>
            <View className="flex-1 relative justify-end">
                <View className="flex-1 bg-black/70" />
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
