import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { cn } from '../../../functions/utils'
import { VerifiedBadge } from '../../verifiedBadge'
import { Image } from 'expo-image'
import { router } from 'expo-router'

interface Params {
    list: EventGroup[]
    loadEvents?: () => void
    fetching?: boolean
    showOrganization?: boolean
}

interface RenderDayParams extends EventDay {
    year: number
    month: number
}

export function ListEvents({ list, loadEvents, fetching, showOrganization = true }: Params) {
    const renderEvent = ({ title, description, start, end, postId, level, organization }: PostEvent) => {
        const startHourString = start ? start.toLocaleTimeString(['pt-br'], { hour: '2-digit', minute: '2-digit' }) : ''
        const endHourString = end ? end.toLocaleTimeString(['pt-br'], { hour: '2-digit', minute: '2-digit' }) : ''

        return (
            <TouchableOpacity
                key={postId}
                onPress={() => {
                    router.push(`/authenticated/post/${postId}`)
                }}>
                {showOrganization && (
                    <View className="border border-stone-200 bg-stone-50 rounded-lg rounded-b-none border-b-0 p-2">
                        <TouchableOpacity
                            onPress={() => {
                                router.push(`/authenticated/organization/${organization.id}`)
                            }}
                            className="flex-row items-center"
                            style={{ gap: 8 }}>
                            <Image source={organization.pictureUrl} placeholder={organization.name} className="h-6 w-6 rounded-lg" />
                            <View className="flex-row" style={{ gap: 4 }}>
                                <Text className="font-bold">{organization.displayName}</Text>
                                {organization.verified && <VerifiedBadge type="organization" size="xs" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                <View
                    className={cn(
                        'border border-stone-200 rounded-lg p-2',
                        level === 'URGENT' && 'bg-red-600 border-red-600',
                        level === 'IMPORTANT' && 'bg-primary border-primary',
                        showOrganization && 'rounded-t-none'
                    )}>
                    <Text
                        className={cn(
                            'text-headline font-bold flex-1',
                            level === 'URGENT' && 'text-white',
                            level === 'IMPORTANT' && 'text-headline'
                        )}>
                        {title}
                    </Text>
                    {description && (
                        <Text
                            className={cn('text-stone-800 flex-1', level === 'URGENT' && 'text-stone-100', level === 'IMPORTANT' && 'text-headline')}
                            style={{ fontSize: 14 }}>
                            {description}
                        </Text>
                    )}
                    <View className="mt-1">
                        {startHourString && !endHourString && (
                            <Text
                                className={cn(
                                    'text-stone-800 flex-1',
                                    level === 'URGENT' && 'text-stone-100',
                                    level === 'IMPORTANT' && 'text-headline'
                                )}
                                style={{ fontSize: 13 }}>
                                Começa {startHourString}
                            </Text>
                        )}
                        {endHourString && !startHourString && (
                            <Text
                                className={cn(
                                    'text-stone-800 flex-1',
                                    level === 'URGENT' && 'text-stone-100',
                                    level === 'IMPORTANT' && 'text-headline'
                                )}
                                style={{ fontSize: 13 }}>
                                Termina {endHourString}
                            </Text>
                        )}
                        {startHourString && endHourString && (
                            <Text
                                className={cn(
                                    'text-stone-800 flex-1',
                                    level === 'URGENT' && 'text-stone-100',
                                    level === 'IMPORTANT' && 'text-headline'
                                )}
                                style={{ fontSize: 13 }}>
                                {startHourString} - {endHourString}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderDay = ({ day, events, month, year }: RenderDayParams) => {
        const now = new Date()
        const isToday = now.getDate() === day && now.getMonth() === month && now.getFullYear() === year
        const dayNameResume = new Date(year, month, day).toLocaleDateString('pt-BR', { weekday: 'long' }).slice(0, 3).toUpperCase()

        return (
            <View key={`day-${year}-${month}-${day}`} className="flex-row" style={{ gap: 16 }}>
                <View>
                    <Text
                        className={cn('text-stone-600', isToday && 'font-bold text-teal-600')}
                        style={{
                            fontSize: 12,
                        }}>
                        {dayNameResume}
                    </Text>
                    <Text
                        className={cn('text-stone-600', isToday && 'font-bold text-teal-600')}
                        style={{
                            fontSize: 20,
                        }}>
                        {String(day).padStart(2, '0')}
                    </Text>
                </View>
                <View style={{ gap: 8 }} className="flex-1">
                    {events.map(renderEvent)}
                </View>
            </View>
        )
    }

    const renderGroup = ({ days, month, year }: EventGroup) => {
        const monthDate = new Date(year, month)
        const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long' })

        return (
            <View key={`group-${year}-${month}`} style={{ gap: 8 }}>
                <Text className="text-center" style={{ fontSize: 18 }}>
                    {monthName} {year}
                </Text>
                <View className="flex-1" style={{ gap: 16 }}>
                    {days.map((day) => renderDay({ ...day, month, year }))}
                </View>
            </View>
        )
    }

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, gap: 12 }}
            refreshControl={<RefreshControl refreshing={fetching || false} onRefresh={loadEvents} />}>
            {list.length === 0 && !fetching && (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-stone-500" style={{ fontSize: 16 }}>
                        Nenhum evento encontrado
                    </Text>
                </View>
            )}
            {list.map(renderGroup)}
        </ScrollView>
    )
}
