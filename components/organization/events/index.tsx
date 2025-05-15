import { View } from 'react-native'
import { ListEvents } from '../../../components/posts/events/ListEvents'
import { useEffect, useRef, useState } from 'react'
import { apiGetOrganizationEvents } from '../../../api/organization/getOrganizationEvents'
import { useOrganization } from '../../../hooks/organization'

export default function OrganizationEvents() {
    const org = useOrganization()
    if (!org) return null

    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventGroup[]>([])

    const debounceFindEvents = useRef<NodeJS.Timeout>(undefined)

    useEffect(() => {
        findEvents()
    }, [])

    const findEvents = () => {
        setLoading(true)
        clearTimeout(debounceFindEvents.current)

        debounceFindEvents.current = setTimeout(() => {
            apiGetOrganizationEvents({ id: org.organization.id })
                .then(setEvents)
                .finally(() => setLoading(false))
        }, 500)
    }

    return (
        <View className="flex-1 bg-white">
            <ListEvents list={events} fetching={loading} loadEvents={findEvents} showOrganization={false} />
        </View>
    )
}
