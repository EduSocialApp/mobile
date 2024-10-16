import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useUser } from '../../../hooks/user'
import { UserBasicView } from '../../userBasicView'
import { router } from 'expo-router'

interface FamilyMember {
    isSupervisor: boolean
    isSupervised: boolean
    name: string
    biography: string
    displayName: string
    id: string
    pictureUrl: string
}

function makeUniqueList(supervisedUsers: SupervisedUser[] = [], supervisorUsers: SupervisorUsers[] = []) {
    const list: FamilyMember[] = []

    supervisorUsers.forEach(({ supervisedUser }) => {
        const { name, biography, displayName, id, pictureUrl } = supervisedUser
        list.push({ isSupervisor: false, isSupervised: true, name, biography, displayName, id, pictureUrl })
    })

    supervisedUsers.forEach(({ supervisorUser }) => {
        const { name, biography, displayName, id, pictureUrl } = supervisorUser
        list.push({ isSupervisor: true, isSupervised: false, name, biography, displayName, id, pictureUrl })
    })

    return list
}

export function ProfileFamily() {
    const userHook = useUser()
    if (!userHook) return null

    const {
        user: { supervisedUsers, supervisorUsers },
    } = userHook

    const list = makeUniqueList(supervisedUsers, supervisorUsers)

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="py-4" style={{ gap: 20 }}>
                {list.map(({ biography, displayName, id, pictureUrl, isSupervisor }, index) => {
                    return (
                        <TouchableOpacity className="flex-1" key={index} onPress={() => router.push(`/authenticated/profile/${id}`)}>
                            <UserBasicView
                                title={displayName}
                                urlPicture={pictureUrl}
                                info={biography}
                                badge={isSupervisor ? 'Supervisor' : undefined}
                            />
                        </TouchableOpacity>
                    )
                })}
            </View>
        </ScrollView>
    )
}
