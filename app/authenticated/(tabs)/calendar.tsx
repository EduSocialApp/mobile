import { Text, View } from 'react-native'
import { ListEvents } from '../../../components/posts/events/ListEvents'
import { useEffect, useRef, useState } from 'react'
import { apiGetUserEvents } from '../../../api/user/getUserEvents'
import SafeView from '../../../components/safeView'

export default function Calendar() {
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
            apiGetUserEvents()
                .then(setEvents)
                .finally(() => setLoading(false))
        }, 500)
    }

    return (
        <SafeView className="relative flex-1 bg-white" edges={['top']}>
            <View className="relative mt-2 pb-2 h-10 items-center justify-center border-b border-stone-100">
                <Text style={{ fontSize: 18 }} className="font-semibold">
                    Eventos em Andamento e Próximos
                </Text>
            </View>
            <View className="flex-1">
                <ListEvents list={events} fetching={loading} loadEvents={findEvents} />
            </View>
        </SafeView>
    )
}
