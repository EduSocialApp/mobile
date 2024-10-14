import { View, Text } from 'react-native'

export function SettingContainer({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <View className="p-2" style={{ gap: 10 }}>
            {title && <Text className="font-bold text-stone-500 ml-3">{title}</Text>}
            <View className="bg-white rounded-xl p-4" style={{ gap: 30 }}>
                {children}
            </View>
        </View>
    )
}
