import { useLocalSearchParams } from 'expo-router'
import { Profile } from '../../../components/user'

export default function ProfileView() {
    const { id } = useLocalSearchParams()

    return <Profile id={id as string} header />
}
