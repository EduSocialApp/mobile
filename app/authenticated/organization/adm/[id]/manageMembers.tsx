import { View, Text } from 'react-native'
import { useOrganization } from '../../../../../hooks/organization'
import { Header } from '../../../../../components/header'

export default function ManageMembers() {
    const org = useOrganization()
    if (!org) return <Text>nao entrou aqui</Text>

    const { displayName } = org.organization

    return (
        <View className="flex-1 bg-white">
            <Header title="Gerenciar membros" backButton />
            <View className="items-center p-2"></View>
        </View>
    )
}
