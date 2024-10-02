import { Text, View, ScrollView } from 'react-native'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { expo } from '../../../app.json'
import { useUserAuthenticated } from '../../../hooks/authenticated'

export default function Settings() {
    const { logout } = useUserAuthenticated()

    return (
        <View className="flex-1 bg-stone-50">
            <Header title="Configurações" backButton />

            <ScrollView>
                <View className="bg-white p-5" style={{ gap: 20 }}>
                    <Text className="font-bold text-stone-600">Login</Text>
                    <View>
                        <Button variant="link" onPress={logout}>
                            <Text className="font-semibold text-red-500 flex-1">Desconectar</Text>
                        </Button>
                    </View>
                </View>

                <View className="p-5 items-center">
                    <Text className="text-stone-500">Versão {expo.version}</Text>
                </View>
            </ScrollView>
        </View>
    )
}
