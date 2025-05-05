import { ActivityIndicator, RefreshControl, Text, Touchable, TouchableOpacity, View } from 'react-native'

import Modal from '../modals/base'
import { useEffect, useRef, useState } from 'react'
import { apiGetOrganizationAddresses } from '../../api/organization/getOrganizationAddresses'
import { ScrollView } from 'react-native-gesture-handler'

interface Params {
    visible: boolean
    onClose: (address?: Address) => void
    organizationId: string
}

export function PickAddressModal({ visible, onClose, organizationId }: Params) {
    const [loading, setLoading] = useState(false)
    const [addresses, setAddresses] = useState<Address[]>([])

    const debounceRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        searchAddresses()
    }, [visible])

    const searchAddresses = () => {
        clearTimeout(debounceRef.current)

        setLoading(true)
        debounceRef.current = setTimeout(() => {
            apiGetOrganizationAddresses({ id: organizationId })
                .then(setAddresses)
                .catch(() => setAddresses([]))
                .finally(() => {
                    setLoading(false)
                })
        }, 500)
    }

    return (
        <Modal isVisible={visible} close={() => onClose(undefined)} title="Selecionar endereço">
            <ScrollView
                className="flex-1"
                refreshControl={<RefreshControl refreshing={loading} onRefresh={searchAddresses} />}
                contentContainerStyle={{
                    padding: 12,
                    gap: 8,
                }}>
                {!loading && addresses.length === 0 && (
                    <View className="m-5 rounded-lg">
                        <Text className="text-center text-stone-500">Nenhum endereço localizado</Text>
                    </View>
                )}
                {addresses.map((address) => {
                    const { id, street, number, complement, neighborhood, city, state, zipCode, country } = address

                    return (
                        <TouchableOpacity key={id} className="bg-stone-100 p-5 rounded-lg" onPress={() => onClose(address)}>
                            <Text>
                                {street}, {number}
                                {complement ? ` - ${complement}` : ''}. {neighborhood}. {city} - {state}, {zipCode}, {country}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </Modal>
    )
}
