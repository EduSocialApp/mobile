import { View, Text } from 'react-native'
import { TextBubble } from '../textBubble'
import { useUserAuthenticated } from '../../hooks/authenticated'
import { cn } from '../../functions/utils'

export function MessageItem(message: Message) {
    const { user } = useUserAuthenticated()
    const idUser = user?.id || ''
    const loggedIsSender = message.user.id === idUser

    return (
        <View className={cn('w-full', loggedIsSender && 'items-end')}>
            <View className="max-w-[85%]">
                <TextBubble
                    text={message.content}
                    theme={loggedIsSender ? 'primary' : 'white'}
                    direction={loggedIsSender ? 'right' : 'left'}
                    contact={
                        !loggedIsSender
                            ? {
                                  id: message.user.id,
                                  name: message.user.name,
                                  displayName: message.user.displayName,
                                  pictureUrl: message.user.pictureUrl,
                                  type: 'user',
                                  verified: false,
                                  role: '',
                              }
                            : undefined
                    }
                />
            </View>
        </View>
    )
}
