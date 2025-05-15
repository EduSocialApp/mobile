import { Text, View, ScrollView, KeyboardAvoidingView, Alert } from 'react-native'
import { Header } from '../../../../components/header'
import { Button, TextInput } from '../../../../components'
import { Controller, useForm } from 'react-hook-form'
import { maskCep, maskCnpj } from '../../../../functions/masks'
import { cnpjScan } from '../../../../api/thirdParties/cnpjScan'
import { ModalLoading } from '../../../../components/modals/loading'
import { useState } from 'react'
import { cepScan } from '../../../../api/thirdParties/cepScan'
import { apiOrganizationRegister } from '../../../../api/organization/register'
import { router } from 'expo-router'
import { handleErrorWithAlert } from '../../../../functions/handleError'
import SafeView from '../../../../components/safeView'

const gap = 18

interface FormNewOrganization {
    name: string
    displayName: string
    email: string
    document: string
    cep: string
    city: string
    state: string
    street: string
    number: string
    neighborhood: string
    complement: string
    ibgeCode: string
}

export default function CreateOrganization() {
    const [loading, setLoading] = useState<string>()

    const { control, setValue, getValues, watch } = useForm<FormNewOrganization>()

    const searchCnpj = async (cnpj: string) => {
        setLoading('cnpj')
        try {
            const {
                estabelecimento: {
                    email,
                    bairro,
                    cep,
                    cidade: { nome: cidadeNome, ibge_id },
                    estado: { sigla: estadoSigla },
                    logradouro,
                    numero,
                    complemento,
                    nome_fantasia,
                },
                razao_social,
            } = await cnpjScan(cnpj)

            setValue('name', razao_social)
            setValue('displayName', nome_fantasia || '')
            setValue('email', email)

            setValue('cep', maskCep(cep))
            setValue('ibgeCode', String(ibge_id))
            setValue('city', cidadeNome)
            setValue('state', estadoSigla)
            setValue('street', logradouro)
            setValue('number', numero)
            setValue('neighborhood', bairro)
            setValue('complement', complemento || '')
        } catch {
            // Nao faz nada
        }
        setLoading(undefined)
    }

    const searchCep = async (cep: string) => {
        setLoading('cep')
        try {
            const { localidade, uf, logradouro, bairro, ibge, complemento } = await cepScan(cep)

            setValue('city', localidade)
            setValue('state', uf)
            setValue('street', logradouro)
            setValue('neighborhood', bairro)
            setValue('ibgeCode', ibge)
            setValue('complement', complemento || '')
        } catch {
            // Nao faz nada
        }
        setLoading(undefined)
    }

    const handleFormSubmit = async () => {
        const { cep, city, complement, document, email, ibgeCode, name, neighborhood, number, state, street, displayName } = getValues()

        if (!cep || !city || !document || !email || !ibgeCode || !name || !neighborhood || !number || !state || !street || !displayName) {
            return Alert.alert('Erro', 'Campos obrigatórios não preenchidos')
        }

        setLoading('form')
        try {
            await apiOrganizationRegister({
                address: {
                    city,
                    complement,
                    country: 'Brasil',
                    ibgeCode,
                    neighborhood,
                    number,
                    state,
                    street,
                    zipCode: cep,
                },
                document,
                email,
                name,
                displayName,
                phone: '',
                pictureUrl: '',
            })

            router.back()
        } catch (e) {
            handleErrorWithAlert(e)
        }

        setLoading(undefined)
    }

    const loadingText = {
        cnpj: 'Buscando informações do CNPJ',
        cep: 'Buscando informações do CEP',
    }[loading || '']

    return (
        <SafeView className="bg-white">
            <ModalLoading open={!!loadingText} text={loadingText} />
            <Header title="Nova instituição" backButton />

            <ScrollView>
                <View className="p-4 flex-1" style={{ gap }}>
                    <Text>Informações básicas</Text>
                    <Controller
                        control={control}
                        name="document"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                onChangeText={(v) => {
                                    const maskedValue = maskCnpj(v)

                                    if (maskedValue.length === 18) searchCnpj(v)

                                    onChange(maskedValue)
                                }}
                                value={value}
                                placeholder="CNPJ"
                                help="Ao preencher o CNPJ será feita uma busca automática dos dados no site CNPJ.ws"
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) => (
                            <TextInput onChangeText={onChange} value={value} placeholder="Nome da instituição" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="displayName"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                onChangeText={onChange}
                                value={value}
                                placeholder="Nome de exibição"
                                help="Esse nome será exibido para os outros usuários. (Máximo de 20 caracteres)"
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                onChangeText={onChange}
                                value={value}
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <Text>Endereço</Text>
                    <Controller
                        control={control}
                        name="cep"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                onChangeText={(v) => {
                                    const maskedValue = maskCep(v)

                                    if (maskedValue.length === 9) searchCep(v)

                                    onChange(maskedValue)
                                }}
                                value={value}
                                placeholder="CEP"
                                help="Ao preencher o CEP será feita uma busca automática dos dados no site ViaCEP"
                            />
                        )}
                    />
                    <View className="flex-row" style={{ gap }}>
                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="city"
                                render={({ field: { value } }) => (
                                    <TextInput onChangeText={() => {}} value={value} placeholder="Cidade" editable={false} />
                                )}
                            />
                        </View>
                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="state"
                                render={({ field: { value } }) => (
                                    <TextInput onChangeText={() => {}} value={value} placeholder="Estado" editable={false} />
                                )}
                            />
                        </View>
                    </View>
                    <Controller
                        control={control}
                        name="street"
                        render={({ field: { value, onChange } }) => <TextInput onChangeText={onChange} value={value} placeholder="Rua" />}
                    />
                    <Controller
                        control={control}
                        name="number"
                        render={({ field: { value, onChange } }) => <TextInput onChangeText={onChange} value={value} placeholder="Número" />}
                    />
                    <Controller
                        control={control}
                        name="neighborhood"
                        render={({ field: { value, onChange } }) => <TextInput onChangeText={onChange} value={value} placeholder="Bairro" />}
                    />
                    <Controller
                        control={control}
                        name="complement"
                        render={({ field: { value, onChange } }) => <TextInput onChangeText={onChange} value={value} placeholder="Complemento" />}
                    />
                </View>
            </ScrollView>

            <View className="p-4 border-t border-stone-100">
                <Button onPress={handleFormSubmit} text="Criar instituição" variant="primary" loading={loading === 'form'} />
            </View>
        </SafeView>
    )
}
