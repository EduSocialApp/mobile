import { View, Text } from 'react-native'
import { useOrganization } from '../../../../../hooks/organization'
import { Header } from '../../../../../components/header'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import OrganizationAddMembers from '../../../../../components/organization/administration/addMembers'

const Tab = createMaterialTopTabNavigator()

export default function ManageMembers() {
    const org = useOrganization()
    if (!org) return <Text>nao entrou aqui</Text>

    return (
        <View className="flex-1 bg-white">
            <Header title="Gerenciar membros" backButton />
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#000000',
                    tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
                    tabBarIndicatorStyle: { backgroundColor: '#000000' },
                    tabBarStyle: {},
                }}>
                <Tab.Screen name="add" component={OrganizationAddMembers} options={{ tabBarLabel: 'Adicionar' }} />
            </Tab.Navigator>
        </View>
    )
}
