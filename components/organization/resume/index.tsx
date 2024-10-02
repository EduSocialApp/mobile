import { View, Text, ScrollView } from 'react-native'
import { useOrganization } from '../../../hooks/organization'
import { maskCnpj } from '../../../functions/masks'
import { ReactNode } from 'react'
import { Badge } from '../../badge'

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
    const organization = useOrganization()

    if (!organization) {
        return null
    }

    const { addresses, document, verified, rejectedVerificationMessage, createdAt, updatedAt } = organization

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

            <Container title="Endereço(s)">
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
        </ScrollView>
    )
}
