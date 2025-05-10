import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { ContactList } from '../../../components/messages/contactList'
import { router } from 'expo-router'
import { saveCache } from '../../../cache/asyncStorage'

export default function Messages() {
    const [visibleModalContacts, setVisibleModalContacts] = useState(false)

    return (
        <SafeAreaView className="relative flex-1 bg-white">
            <ContactList
                visible={visibleModalContacts}
                whenClose={() => {
                    setVisibleModalContacts(false)
                }}
                whenSelected={async (contact) => {
                    await saveCache('CONVERSATION_CONTACT', contact)

                    setVisibleModalContacts(false)
                    router.push('/authenticated/conversation/novo')
                }}
            />

            <TouchableOpacity className="absolute bottom-2 right-2 p-4 bg-headline rounded-full z-10" onPress={() => setVisibleModalContacts(true)}>
                <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
            </TouchableOpacity>

            <View className="relative mt-2 pb-2 h-10 items-center justify-center border-b border-stone-100">
                <Text style={{ fontSize: 18 }} className="font-semibold">
                    Conversas
                </Text>
            </View>
            <View className="flex-1"></View>
        </SafeAreaView>
    )
}
