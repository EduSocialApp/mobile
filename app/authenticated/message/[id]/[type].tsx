import { SafeAreaView, View, Text } from 'react-native'

export function Conversation({ id, type }: { id: string; type: 'user' | 'organization' }) {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                <Text>Conversation</Text>
            </View>
            <Text>{id}</Text>
            <Text>{type}</Text>
        </SafeAreaView>
    )
}
