import { View, Text } from 'react-native'
import { Button } from '../../button'
import { router } from 'expo-router'

export function Administration() {
    return (
        <View className="flex-1 bg-white py-5">
            <Button onPress={() => router.push('/authenticated/admin/analyseOrganizations')} text="Analisar instituições" />
        </View>
    )
}
