import { View, Text, TouchableOpacity } from 'react-native'
import { useRef } from 'react'
import PagerView from 'react-native-pager-view'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import constants from 'expo-constants'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'

import imgNetwork from '../assets/apresentation/network.png'
import imgClassroom from '../assets/apresentation/classroom.png'
import imgSchool from '../assets/apresentation/school.png'

import Title, { TitleBlack } from '../components/title'
import { StatusBar } from 'expo-status-bar'
import { saveCache } from '../cache/asyncStorage'

interface IParamsSlide {
    key: string
    image: string
    title: string
    description: string
}

const pages = [
    {
        image: imgNetwork,
        title: 'Bem-vindo',
        description:
            'Cadastre-se agora e tenha acesso a uma agenda escolar detalhada, notificações de eventos imperdíveis e recursos de aprendizado incríveis!',
    },
    {
        image: imgClassroom,
        title: 'Fique por dentro de tudo',
        description: 'O EduSocial mantém você sempre conectado com o que acontece nas instituições que você estuda',
    },
    {
        image: imgSchool,
        title: 'Educação é parceria',
        description: 'recursos de estudo, links úteis e agendamento de reuniões diretamente no app',
    },
]

export default function Apresentation() {
    const currentPageTranslateX = useSharedValue(0)

    const barWidth = useRef<number>(0)

    const Slide = ({ key, image, title, description }: IParamsSlide) => (
        <View key={key} className="flex-1">
            <View className="flex-1 items-center justify-center">
                <Image source={image} className="w-full h-full p-2" style={{ maxWidth: 500 }} contentFit="contain" />
            </View>
            <View className="m-3 rounded-md mb-6">
                <Text className="font-bold text-xl">{title}</Text>
                <Text className="mt-2 text-base">{description}</Text>
            </View>
        </View>
    )

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withSpring(currentPageTranslateX.value),
            },
        ],
    }))

    return (
        <View className="flex-1">
            <StatusBar style="dark" />
            <LinearGradient colors={['#ffffff', '#f0f0f0']} className="absolute flex-1 z-0 w-full h-full" />

            <View className="flex-1" style={{ paddingTop: constants.statusBarHeight + 10 }}>
                <View className="mt-2">
                    <TitleBlack />
                </View>
                <PagerView
                    className="flex-1"
                    initialPage={0}
                    onPageSelected={({ nativeEvent: { position } }) => {
                        currentPageTranslateX.value = barWidth.current * position
                    }}>
                    {pages.map((slideParams, i) => (
                        <Slide key={`slide-${i}`} {...slideParams} />
                    ))}
                </PagerView>
                <View>
                    <View className="h-2 mx-3 opacity-80 rounded-full" style={{ backgroundColor: '#ffffffff' }}>
                        <Animated.View
                            onLayout={({
                                nativeEvent: {
                                    layout: { width },
                                },
                            }) => {
                                barWidth.current = width
                            }}
                            className="h-full w-1/3 bg-headline rounded-full"
                            style={animatedStyle}
                        />
                    </View>
                </View>
                <View className="p-3 mb-6">
                    <TouchableOpacity
                        onPress={() => {
                            saveCache('SAW_PRESENTATION', true)
                            router.replace('/login')
                        }}
                        className="bg-headline items-center justify-center rounded-md mb-1">
                        <Text className="p-4 text-xl font-semibold text-white">Entrar agora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 8 }} onPress={() => router.push('/createAccount')}>
                        <Text className="text-center mt-1">
                            Não tem uma conta? <Text className="font-bold">Criar agora</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
