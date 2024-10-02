import { useLocalSearchParams } from 'expo-router'
import { Organization } from '../../../components/organization'

export default function OrganizationView() {
    const { id } = useLocalSearchParams()

    return <Organization id={id as string} header />
}
