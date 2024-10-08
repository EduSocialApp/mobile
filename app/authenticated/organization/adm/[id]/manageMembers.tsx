import { View, Text } from 'react-native'
import { useOrganization } from '../../../../../hooks/organization'
import { Header } from '../../../../../components/header'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import OrganizationAddMembers from '../../../../../components/organization/administration/addMembers'
import OrganizationsManageExistentsMembers from '../../../../../components/organization/administration/manageMembers'

const Tab = createMaterialTopTabNavigator()

export default function ManageMembers() {
    const org = useOrganization()
    if (!org) return <Text>nao entrou aqui</Text>

    const { displayName } = org.organization

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
                <Tab.Screen name="manage" component={OrganizationsManageExistentsMembers} options={{ tabBarLabel: 'Membros' }} />
            </Tab.Navigator>
        </View>
    )
}
