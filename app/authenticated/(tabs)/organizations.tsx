import { Text, View } from 'react-native'
import { Header } from '../../../components/header'

export default function Organizations() {
    return (
        <View className="flex-1 bg-white">
            <Header title="Instituições" />
            <View className="p-4">
                <View className="">
                    <Text className="text-lg font-bold">Minhas intituições</Text>
                    <Text>Instituições em que estou vinculado, tudo em um só lugar</Text>
                </View>
            </View>
        </View>
    )
}
