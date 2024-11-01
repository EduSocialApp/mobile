import { MaterialCommunityIcons } from '@expo/vector-icons'
import { orgVerification, userVerification } from '../functions/colors'

interface Params {
    type: 'user' | 'organization'
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function VerifiedBadge({ type, size = 'sm' }: Params) {
    const color = {
        user: userVerification,
        organization: orgVerification,
    }[type]

    const sizeBadge = {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
    }[size]

    return <MaterialCommunityIcons name="check-decagram" size={sizeBadge} color={color} />
}
