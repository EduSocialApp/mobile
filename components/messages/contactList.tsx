import { Text, TouchableOpacity, View } from 'react-native'
import Modal from '../modals/base'
import { useEffect, useRef, useState } from 'react'
import { apiContacList } from '../../api/user/getContactList'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { placeholderImage } from '../../functions/placeholderImage'
import { VerifiedBadge } from '../verifiedBadge'
import { UserBasicView } from '../userBasicView'

interface Params {
    visible?: boolean
    whenSelected?: (contact: Contact) => void
    whenClose?: () => void
}

export function ContactList({ visible = true, whenClose = () => {}, whenSelected = () => {} }: Params) {
    const [loading, setLoading] = useState(false)
    const [contactList, setContactList] = useState<Contact[]>([])

    const debounceFetch = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (visible) {
            fetchContactList()
        }
    }, [visible])

    const fetchContactList = async () => {
        if (debounceFetch.current) {
            clearTimeout(debounceFetch.current)
        }

        debounceFetch.current = setTimeout(async () => {
            setLoading(true)
            apiContacList()
                .then((contactList) => {
                    console.log('contactList', contactList)
                    if (contactList) {
                        setContactList(contactList)
                    }
                })
                .catch(() => {
                    setLoading(false)
                })
        }, 500)
    }

    const renderContact = ({ item }: { item: Contact }) => {
        const { id, name, displayName, pictureUrl, verified } = item
        return (
            <TouchableOpacity className="p-2" onPress={() => whenSelected(item)}>
                <UserBasicView title={displayName || name} urlPicture={pictureUrl} badge={verified ? '1' : undefined} />
            </TouchableOpacity>
        )
    }

    return (
        <Modal isVisible={visible} close={whenClose} title="Contatos">
            <FlashList
                data={contactList}
                renderItem={renderContact}
                estimatedItemSize={100}
                ItemSeparatorComponent={() => <View className="h-[1] bg-stone-100" />}
            />
        </Modal>
    )
}
