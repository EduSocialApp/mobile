import { ReactNode, useRef } from 'react'
import { Modal as ModalReact, View, Text, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native'
import { GestureDetector, Gesture, gestureHandlerRootHOC } from 'react-native-gesture-handler'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'
import { MaterialIcons } from '@expo/vector-icons'

interface ModalProps {
    isVisible: boolean
    children: ReactNode
    topView?: ReactNode
    bottomView?: ReactNode
    close: () => void
    title?: string
    flex?: boolean
}

export default function Modal({ isVisible, children, title, close, topView, bottomView, flex = true }: ModalProps) {
    if (!flex) {
        return (
            <ModalReact animationType="slide" transparent={true} visible={isVisible}>
                <View className="bg-black/80 flex-1 justify-end">
                    <KeyboardAvoidingView behavior="padding" className="bg-white rounded-t-xl">
                        <View className="flex-row border-b border-stone-200  p-5 py-2 items-center justify-center relative">
                            {title ? (
                                <>
                                    <Text className="font-semibold text-base">{title}</Text>
                                    <TouchableOpacity className="absolute items-end right-5 py-2 w-10" onPress={close}>
                                        <MaterialIcons name="close" color="#000000" size={22} />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View className="h-3 w-14 rounded-full bg-stone-300" />
                            )}
                        </View>

                        {topView}
                        <View className="bg-white">{children}</View>
                        {bottomView}
                    </KeyboardAvoidingView>
                </View>
            </ModalReact>
        )
    }

    const translateY = useSharedValue(0)
    const headerHeight = useRef(60)

    const panGesture = Gesture.Pan()
        .onUpdate(({ translationY, y }) => {
            if (y > headerHeight.current * 2) {
                return (translateY.value = withTiming(0))
            }

            if (translationY < 0) {
                return (translateY.value = 0)
            }

            translateY.value = translationY
        })
        .onEnd(() => {
            if (translateY.value > 150) {
                close()
            }

            translateY.value = withTiming(0)
        })
        .runOnJS(true)

    const Body = gestureHandlerRootHOC(() => (
        <Animated.View
            className="flex-1 bg-white mt-10 rounded-t-lg"
            style={{
                marginTop: 90,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
                transform: [{ translateY }],
            }}>
            <GestureDetector gesture={panGesture}>
                <View
                    onLayout={({
                        nativeEvent: {
                            layout: { height },
                        },
                    }) => {
                        headerHeight.current = height
                    }}
                    className="flex-row border-b border-stone-100 p-5 py-3 items-center justify-center relative">
                    {title ? (
                        <>
                            <Text className="font-semibold text-base">{title}</Text>
                            <TouchableOpacity className="absolute items-end right-5 py-2 w-10" onPress={close}>
                                <MaterialIcons name="close" color="#000000" size={24} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View className="h-3 w-14 rounded-full bg-stone-300" />
                    )}
                </View>
            </GestureDetector>

            {topView}
            <View className="flex-1">{children}</View>
            {bottomView}
        </Animated.View>
    ))

    return (
        <ModalReact animationType="slide" transparent={true} visible={isVisible}>
            <View className="flex-1 bg-black/70">
                <Body />
            </View>
        </ModalReact>
    )
}
