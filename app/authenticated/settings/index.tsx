import { Text, View, ScrollView } from 'react-native'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { expo } from '../../../app.json'
import { useUserAuthenticated } from '../../../hooks/authenticated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SettingContainer } from '../../../components/settingContainer'

export default function Settings() {
    const { logout } = useUserAuthenticated()

    return (
        <View className="flex-1 bg-stone-100">
            <Header title="Configurações" backButton />

            <ScrollView contentContainerStyle={{ paddingVertical: 20, gap: 10 }}>
                <SettingContainer>
                    <View className="flex-row items-center">
                        <View className="flex-1 relative" style={{ gap: 2 }}>
                            <Text className="font-semibold">Responsável por uma instituição?</Text>
                            <Text className="text-stone-600">Junte-se ao EduSocial e crie uma comunidade conectada</Text>
                        </View>
                        <Button
                            onPress={() => {
                                router.push('/authenticated/organization/create')
                            }}
                            variant="primary">
                            <View className="p-5">
                                <MaterialCommunityIcons name="web-plus" size={24} color="#272343" />
                            </View>
                        </Button>
                    </View>
                </SettingContainer>

                <SettingContainer>
                    <Button
                        variant="link"
                        onPress={() => {
                            router.push('/authenticated/family')
                        }}>
                        <MaterialCommunityIcons name="account-group" size={20} />
                        <Text className="flex-1">Família</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} />
                    </Button>
                </SettingContainer>

                <SettingContainer>
                    <Button variant="link">
                        <MaterialCommunityIcons name="file-account" size={20} />
                        <Text className="flex-1">Termos de uso</Text>
                    </Button>
                    <Button variant="link">
                        <MaterialCommunityIcons name="shield-account" size={20} />
                        <Text className="flex-1">Políticas de privacidade</Text>
                    </Button>
                    <Button variant="link" onPress={logout}>
                        <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                        <Text className="font-semibold text-red-500 flex-1">Desconectar</Text>
                    </Button>
                </SettingContainer>

                <View className="items-center">
                    <Text className="text-stone-500">Versão {expo.version}</Text>
                </View>
            </ScrollView>
        </View>
    )
}
