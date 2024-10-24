import { View, Text, ScrollView, Alert, KeyboardAvoidingView } from 'react-native'
import { useOrganization } from '../../../hooks/organization'
import { maskCnpj } from '../../../functions/masks'
import { ReactNode, useEffect, useState } from 'react'
import { Badge } from '../../badge'
import { Image } from 'expo-image'
import { Button } from '../../button'
import { router } from 'expo-router'
import { TextInput } from '../../form'
import { Checkbox } from '../../form/Checkbox'
import { apiRejectOrganization } from '../../../api/organization/reject'
import { apiApproveOrganization } from '../../../api/organization/approve'
import Modal from '../../modals/base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { placeholderImage } from '../../../functions/placeholderImage'

function Container({ title, children }: { children: ReactNode; title: string }) {
    return (
        <View style={{ gap: 8 }}>
            <View className="flex-row">
                <Text className="text-stone-700 font-bold">{title}</Text>
            </View>
            <View>{children}</View>
        </View>
    )
}

export function OrganizationResume() {
    const org = useOrganization()
    if (!org) return null

    const organization = org.organization

    const [avaliation, setAvaliation] = useState<string>('')
    const [statusVerifications, setStatusVerifications] = useState<boolean>(false)
    const [loading, setLoading] = useState<string>()
    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
        if (organization) {
            setAvaliation(organization.rejectedVerificationMessage || '')
            setStatusVerifications(organization.verified)
        }
    }, [organization])

    const onClose = () => {
        setVisible(false)
        org.reload()
    }

    const handleAvaliation = async () => {
        if (!organization) return

        setLoading('avaliation')

        try {
            if (statusVerifications) {
                await apiApproveOrganization(organization.id)
            } else {
                await apiRejectOrganization(organization.id, avaliation)
            }

            onClose()
        } catch {
            Alert.alert('Erro', 'Ocorreu um erro ao enviar a avaliação')
        } finally {
            setLoading(undefined)
        }
    }

    if (!organization) {
        return null
    }

    let { addresses, document, verified, rejectedVerificationMessage, createdAt, updatedAt, owners } = organization

    if (!owners) owners = []

    return (
        <>
            <View className="relative">
                <Button onPress={() => setVisible(true)} size="sm" variant="link">
                    <View className="absolute z-10">
                        <MaterialCommunityIcons name="shield-outline" size={28} color="#ff7300" />
                    </View>
                    <MaterialCommunityIcons name="shield" size={28} color="#ffe0d3" />
                </Button>
            </View>
            <Modal isVisible={visible} close={onClose} title="Resumo">
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <ScrollView className="bg-white" contentContainerStyle={{ gap: 18, padding: 10 }}>
                        <Container title="Avaliação">
                            <View style={{ gap: 8 }}>
                                <Checkbox value={statusVerifications} onChange={setStatusVerifications} label="Verificada" />
                                {!statusVerifications && (
                                    <View>
                                        <TextInput value={avaliation} placeholder="Motivo da rejeição" onChangeText={setAvaliation} />
                                        <Text className="text-xs text-stone-500 mt-2">
                                            Se a instituição for rejeitada e um motivo tiver sido informado, o CNPJ será liberado, permitindo que
                                            outro usuário possa se tornar responsável
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Container>

                        <Container title="Status atual">
                            <View className="mb-2 items-start">
                                {!verified && !rejectedVerificationMessage && <Badge title="Aguardando análise" variant="inactive" />}
                                {!verified && rejectedVerificationMessage && <Badge title="Rejeitado" variant="danger" />}
                                {verified && <Badge title="Ativo" variant="success" />}
                            </View>

                            <Text>CNPJ: {maskCnpj(document)}</Text>
                            <Text>Criado em: {createdAt}</Text>
                            <Text>Atualizado em: {updatedAt}</Text>
                        </Container>

                        <Container title="Contato da instituição">
                            <Text>E-mail: {organization.email}</Text>
                            <Text>Telefone: {organization.phone || 'Não informado'}</Text>
                        </Container>

                        <Container title={addresses.length > 1 ? 'Endereços' : 'Endereço'}>
                            <View style={{ gap: 4 }}>
                                {addresses.map(({ address: { id, street, number, state, city, zipCode } }) => (
                                    <View key={id}>
                                        <Text>
                                            {street}, {number}
                                        </Text>
                                        <Text>
                                            {city} - {state}
                                        </Text>
                                        <Text>CEP: {zipCode}</Text>
                                    </View>
                                ))}
                            </View>
                        </Container>

                        <Container title={owners.length > 1 ? 'Responsáveis' : 'Responsável'}>
                            <View style={{ gap: 8 }}>
                                {owners.map(({ id, user: { id: userId, name, email, pictureUrl } }) => (
                                    <View key={id} className="flex-row justify-between items-center" style={{ gap: 8 }}>
                                        <View className="flex-row items-center" style={{ gap: 8 }}>
                                            <Image placeholder={placeholderImage} source={pictureUrl} className="h-10 w-10 rounded-full" />
                                            <View>
                                                <Text className="font-semibold">{name}</Text>
                                                <Text className="text-stone-600">{email}</Text>
                                            </View>
                                        </View>
                                        <Button
                                            text="Ver perfil"
                                            onPress={() => {
                                                router.push('/authenticated/profile/' + userId)
                                                onClose()
                                            }}
                                            variant="link"
                                        />
                                    </View>
                                ))}
                            </View>
                        </Container>

                        <Button onPress={handleAvaliation} text="Enviar avaliação" variant="primary" loading={loading === 'avaliation'} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </>
    )
}
