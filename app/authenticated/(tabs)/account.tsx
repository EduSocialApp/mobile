import { Profile } from '../../../components/profile'
import { useUserAuthenticated } from '../../../hooks/authenticated'

export default function Account() {
    const user = useUserAuthenticated().user
    if (!user) return null

    return <Profile id={user.id} withConfig />
}
