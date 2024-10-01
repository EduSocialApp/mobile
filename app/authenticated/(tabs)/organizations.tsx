import { Text, View } from 'react-native'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function Organizations() {
    return (
        <View className="flex-1 bg-white">
            <Header title="Instituições" />
            <View className="p-4" style={{ gap: 18 }}>
                <View>
                    <Text className="text-lg font-bold">Minhas intituições</Text>
                    <Text>Todas as instituições com as quais estou conectado, em um só lugar</Text>
                </View>

                <View className="bg-stone-100 p-2 rounded-md flex-row" style={{ gap: 12 }}>
                    <View className="flex-1" style={{ gap: 2 }}>
                        <Text className="font-semibold text-stone-700">Responsável por uma instituição?</Text>
                        <Text className="text-stone-600">Junte-se ao EduSocial e crie uma comunidade conectada</Text>
                    </View>
                    <Button
                        onPress={() => {
                            router.push('/authenticated/organization/create')
                        }}
                        variant="primary">
                        <MaterialCommunityIcons name="web-plus" size={24} color="#272343" />
                    </Button>
                </View>
            </View>
        </View>
    )
}
