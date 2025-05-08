import { Text, TouchableOpacity, View } from 'react-native'
import Modal from '../modals/base'
import { useEffect, useRef, useState } from 'react'
import { apiContacList } from '../../api/user/getContactList'
import { FlashList } from '@shopify/flash-list'
import { UserBasicView } from '../userBasicView'
import { DataNotFound } from '../404'

interface Params {
    visible?: boolean
    whenSelected?: (contact: Contact) => void
    whenClose?: () => void
}

export function ContactList({ visible = true, whenClose = () => {}, whenSelected = () => {} }: Params) {
    const [loading, setLoading] = useState(false)
    const [contactList, setContactList] = useState<Contact[]>([])

    const debounceFetch = useRef<NodeJS.Timeout>(undefined)

    useEffect(() => {
        if (visible && contactList.length === 0) {
            fetchContactList()
        }
    }, [visible])

    const fetchContactList = async () => {
        clearTimeout(debounceFetch.current)

        debounceFetch.current = setTimeout(async () => {
            setLoading(true)
            apiContacList()
                .then((contactList) => {
                    setContactList(contactList || [])
                })
                .finally(() => {
                    setLoading(false)
                })
        }, 500)
    }

    const renderContact = ({ item }: { item: Contact }) => {
        const { name, displayName, pictureUrl, verified, type } = item
        return (
            <TouchableOpacity className="p-2" onPress={() => whenSelected(item)}>
                <UserBasicView title={displayName || name} urlPicture={pictureUrl} verified={verified} type={type} />
            </TouchableOpacity>
        )
    }

    return (
        <Modal isVisible={visible} close={whenClose} title="Lista de Contatos">
            <FlashList
                data={contactList}
                renderItem={renderContact}
                estimatedItemSize={100}
                refreshing={loading}
                onRefresh={fetchContactList}
                ListEmptyComponent={() => (
                    <View className="p-5">
                        <DataNotFound text="Nenhum contato na lista" backButton={false} />
                    </View>
                )}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
            />
        </Modal>
    )
}
