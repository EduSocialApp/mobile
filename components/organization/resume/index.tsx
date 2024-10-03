import { View, Text, ScrollView, Alert } from 'react-native'
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
    const [avaliation, setAvaliation] = useState<string>('')
    const [statusVerifications, setStatusVerifications] = useState<boolean>(false)
    const [loading, setLoading] = useState<string>()

    const organization = useOrganization()

    useEffect(() => {
        if (organization) {
            setAvaliation(organization.rejectedVerificationMessage || '')
            setStatusVerifications(organization.verified)
        }
    }, [organization])

    const handleAvaliation = async () => {
        if (!organization) return

        setLoading('avaliation')

        try {
            if (statusVerifications) {
                await apiApproveOrganization(organization.id)
            } else {
                await apiRejectOrganization(organization.id, avaliation)
            }

            router.back()
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
        <ScrollView className="bg-white" contentContainerStyle={{ gap: 18, paddingVertical: 20 }}>
            <Container title="Status">
                <View className="mb-2 items-start">
                    {!verified && !rejectedVerificationMessage && <Badge title="Aguardando análise" variant="inactive" />}
                    {!verified && rejectedVerificationMessage && <Badge title="Rejeitado" variant="danger" />}
                    {verified && <Badge title="Ativo" variant="success" />}
                </View>

                {!!rejectedVerificationMessage && (
                    <View className="bg-stone-100 mb-2 p-2 rounded-md">
                        <Text className="text-stone-600">{rejectedVerificationMessage}</Text>
                    </View>
                )}

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
                                <Image source={pictureUrl} className="h-10 w-10 rounded-full" />
                                <View>
                                    <Text className="font-semibold">{name}</Text>
                                    <Text className="text-stone-600">{email}</Text>
                                </View>
                            </View>
                            <Button text="Ver perfil" onPress={() => router.push('/authenticated/profile/' + userId)} variant="link" />
                        </View>
                    ))}
                </View>
            </Container>

            <Container title="Avaliação">
                <View style={{ gap: 8 }}>
                    <Checkbox value={statusVerifications} onChange={setStatusVerifications} label="Verificada" />
                    {!statusVerifications && (
                        <View>
                            <TextInput value={avaliation} placeholder="Motivo da rejeição" onChangeText={setAvaliation} />
                            <Text className="text-xs text-stone-500 mt-2">
                                Se a instituição for rejeitada e um motivo tiver sido informado, o CNPJ será liberado, permitindo que outro usuário
                                possa se tornar responsável
                            </Text>
                        </View>
                    )}
                    <Button onPress={handleAvaliation} text="Enviar avaliação" variant="primary" loading={loading === 'avaliation'} />
                </View>
            </Container>
        </ScrollView>
    )
}
