import { Post } from '../api/user/getUserFeed'

export function postAddressToString(address: Post['address']) {
    if (!address) return ''

    return `${address.street}, ${address.number} ${address.complement ? ` - ${address.complement}` : ''}. ${address.neighborhood}. ${
        address.city
    } - ${address.state}, ${address.zipCode}, ${address.country}`
}
