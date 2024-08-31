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

import { CacheKey, saveCache } from '../functions/cache'

import Title from '../components/title'

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
        description: 'Cadastre-se agora e tenha acesso a uma agenda escolar detalhada, notificações de eventos imperdíveis e recursos de aprendizado incríveis!'
    },
    {
        image: imgClassroom,
        title: 'Fique por dentro de tudo',
        description: 'O EduSocial mantém você sempre conectado com o que acontece nas instituições que você estuda'
    },
    {
        image: imgSchool,
        title: 'Educação é parceria',
        description: 'recursos de estudo, links úteis e agendamento de reuniões diretamente no app'
    }
]

export default function Apresentation() {
    const currentPageTranslateX = useSharedValue(0)

    const barWidth = useRef<number>(0)

    const Slide = ({ key, image, title, description }: IParamsSlide) => (
        <View key={key} style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={image}
                    style={{ width: '100%', height: '100%', maxWidth: 500, padding: 8 }}
                    contentFit='contain'
                />
            </View>
            <View style={{ padding: 12, margin: 12, borderRadius: 6 }}>
                <Text style={{ fontWeight: '600', fontSize: 18, color: '#ffffff' }}>{title}</Text>
                <Text style={{ marginTop: 4, color: '#ffffff' }}>{description}</Text>
            </View>
        </View>
    )

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: withSpring(currentPageTranslateX.value)
        }]
    }))

    return (
        <View className='flex-1'>
            <LinearGradient colors={['#3b82f6', '#6366f1']} className='absolute flex-1 z-0 w-full h-full' />

            <View className='flex-1' style={{ paddingTop: constants.statusBarHeight + 10 }}>
                <Title />
                <PagerView className='flex-1' initialPage={0} onPageSelected={({ nativeEvent: { position } }) => {
                    currentPageTranslateX.value = barWidth.current * position
                }}>
                    {
                        pages.map((slideParams, i) => (
                            <Slide
                                key={`slide-${i}`}
                                {...slideParams}
                            />
                        ))
                    }
                </PagerView>
                <View>
                    <View className='h-2 mx-3 opacity-80 rounded-full' style={{ backgroundColor: '#4f46e5' }}>
                        <Animated.View onLayout={({ nativeEvent: { layout: { width } } }) => {
                            barWidth.current = width
                        }}
                            className='h-full w-1/3 bg-white rounded-full'
                            style={animatedStyle}
                        />
                    </View>
                </View>
                <View className='p-3 mb-6'>
                    <TouchableOpacity onPress={() => {
                        saveCache(CacheKey.sawPresentation, true)
                        router.replace('/login')
                    }} className='bg-white items-center justify-center rounded-md mb-1'>
                        <Text className='p-4 text-xl'>Entrar agora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 8 }} onPress={() => router.push('/createAccount')}>
                        <Text className='text-white text-center mt-1'>Não tem uma conta? <Text className='font-bold'>Criar agora</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}