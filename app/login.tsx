import { useRef, useState } from 'react'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

import { apiAxios } from '../functions/api'

import Message, { IMessageRef, MessageStatus } from '../components/message'

import { destroySession, saveSession } from '../functions/session'

export default function Login() {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [messageVisible, setMessageVisible] = useState<boolean>(false)

	const message = useRef<IMessageRef>(null)

	const login = () => {
		apiAxios.post('/user/authenticate', { email, password }).then(({ data: { 
			message,
			accessToken,
			refreshToken
		} }) => {
			if (message) {
				return userIncorrect()
			}

			saveSession(accessToken, refreshToken)
		}).catch(err => {
			userIncorrect()
		})
	}

	const userIncorrect = () => {
		destroySession()
		message.current?.updateMessage('Usuário ou senha incorretos', MessageStatus.Error)
	}

	return (
		<SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 8, backgroundColor: '#f1f5f9' }}>
			<Message
				ref={message}
				isVisible={messageVisible}
				onClose={() => setMessageVisible(false)}
				onVisible={() => setMessageVisible(true)}
			/>

			<View style={{ marginVertical: 8 }}>
				<Text style={{ textAlign: 'center', fontSize: 24 }}>Edu<Text style={{ fontWeight: '600' }}>Social</Text></Text>
				<Text style={{ textAlign: 'center' }}>Criar slogan</Text>
			</View>

			<View style={{ margin: 12 }}>
				<Text style={{ color: '#374151', fontWeight: '600', fontSize: 18, textAlign: 'center', marginBottom: 16 }}>Entrar com seu email e senha</Text>

				<Text style={{ marginLeft: 5 }}>Email</Text>
				<TextInput
					style={{ borderWidth: 1, borderRadius: 10, borderColor: '#475569', padding: 12 }}
					onChangeText={setEmail}
					value={email}
					placeholder='Email'
					autoCapitalize='none'
					textContentType='emailAddress'
					keyboardType='email-address'
				/>

				<View style={{ marginTop: 12 }}>
					<Text style={{ marginLeft: 5 }}>Senha</Text>
					<TextInput
						style={{ borderWidth: 1, borderRadius: 10, borderColor: '#475569', padding: 12 }}
						onChangeText={setPassword}
						value={password}
						placeholder='Senha'
						textContentType='password'
						secureTextEntry
					/>
				</View>

				<TouchableOpacity>
					<Text style={{ color: '#3b82f6', textAlign: 'right', marginTop: 8, marginRight: 4 }}>Esqueceu sua senha?</Text>
				</TouchableOpacity>

				<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
					<TouchableOpacity onPress={login}>
						<LinearGradient colors={['#3b82f6', '#6366f1']} start={{ x: 0.4, y: 0 }} style={{ padding: 16, width: 256, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
							<Text style={{ color: '#ffffff' }}>Entrar</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 8 }} onPress={() => router.push('/createAccount')}>
					<Text>Não tem uma conta? <Text style={{ fontWeight: '600', color: '#3b82f6' }}>Criar agora</Text></Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}