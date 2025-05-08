import { View, Text } from 'react-native'
import { TextBubble } from '../textBubble'
import { useUser } from '../../hooks/user'
import { useUserAuthenticated } from '../../hooks/authenticated'
import { cn } from '../../functions/utils'

export function MessageItem(message: Message) {
    const { user } = useUserAuthenticated()
    const idUser = user?.id || ''
    const loggedIsSender = message.user.id === idUser

    return (
        <View className={cn('w-full', loggedIsSender && 'items-end')}>
            <View className="max-w-[85%]">
                <TextBubble text={message.content} theme={loggedIsSender ? 'primary' : 'white'} direction={loggedIsSender ? 'right' : 'left'} />
            </View>
        </View>
    )
}
