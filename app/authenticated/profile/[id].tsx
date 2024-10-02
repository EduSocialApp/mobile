import { useLocalSearchParams } from 'expo-router'
import { Profile } from '../../../components/profile'

export default function ProfileView() {
    const { id } = useLocalSearchParams()

    return <Profile id={id as string} />
}
