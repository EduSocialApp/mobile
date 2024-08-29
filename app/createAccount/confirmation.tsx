import { router } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CreateAccountConfirmation() {

    return (
        <SafeAreaView className='flex-1 p-2 bg-slate-200'>
            <View className='flex'>
                <View className='absolute h-full justify-center left-1'>
                    <TouchableOpacity className='z-10' onPress={() => router.back()}>
                        <Text>voltar</Text>
                    </TouchableOpacity>
                </View>

                <Text className='text-center text-2xl'>Edu<Text className='font-semibold'>Social</Text></Text>
            </View>
            <View className='m-1'>
                <Text className='text-2xl my-3 mt-10'>Confirmar conta</Text>
                <Text>Enviamos o email de confirmação de conta para o endereço $email. Digite o código recebido abaixo</Text>

                <View className='mt-2'>
                    <View className='flex-row mt-10'>
                        <View className='flex-1 rounded-full mx-2 h-1 bg-slate-500' />
                        <View className='flex-1 rounded-full mx-2 h-1 bg-slate-500' />
                        <View className='flex-1 rounded-full mx-2 h-1 bg-slate-500' />
                        <View className='flex-1 rounded-full mx-2 h-1 bg-slate-500' />
                    </View>
                </View>
            </View>
            <View className='flex-1 justify-end items-end m-3'>
                <TouchableOpacity onPress={() => {
                    router.push('/createAccount/password')
                }} className='bg-indigo-600 p-3 px-6 w-full items-center rounded-md'>
                    <Text className='text-white'>Definir senha</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}