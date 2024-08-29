import { View, Text, TouchableOpacity } from 'react-native'
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
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <LinearGradient colors={['#3b82f6', '#6366f1']} style={{ flex: 1, position: 'absolute', zIndex: 0, width: '100%', height: '100%' }} />

            <View style={{ paddingTop: constants.statusBarHeight + 10, flex: 1 }}>
                <Title />
                <PagerView style={{ flex: 1 }} initialPage={0} onPageSelected={({ nativeEvent: { position } }) => {
                    currentPageTranslateX.value = 123 * position
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
                    <View style={{ height: 8, marginHorizontal: 12, opacity: 0.8, borderRadius: 100, backgroundColor: '#4f46e5' }}>
                        <Animated.View
                            style={[{
                                height: '100%',
                                width: 123,
                                backgroundColor: '#ffffff',
                                borderRadius: 100,
                            }, animatedStyle]}
                        />
                    </View>
                </View>
                <View style={{ padding: 12, marginBottom: 24 }}>
                    <TouchableOpacity onPress={() => {
                        saveCache(CacheKey.sawPresentation, true)
                        router.replace('/login')
                    }} style={{ backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderRadius: 6, marginBottom: 4 }}>
                        <Text style={{ fontSize: 18, padding: 12 }}>Entrar agora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 8 }} onPress={() => router.push('/createAccount')}>
                        <Text style={{ textAlign: 'center', color: '#ffffff' }}>Não tem uma conta? <Text style={{ fontWeight: '600' }}>Criar agora</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}