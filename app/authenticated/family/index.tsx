import { Text, View, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { SettingContainer } from '../../../components/settingContainer'
import imgFamily from '../../../assets/others/elephant family-rafiki.png'
import { router } from 'expo-router'
import { ScanQrCode } from '../../../components/modals/scanQrcode'
import { useEffect, useState } from 'react'
import { apiLinkSupervisorToUser } from '../../../api/user/supervised/linkSupervisorToUser'
import { AxiosError } from 'axios'
import { translateMessage } from '../../../translate/translateMessage'
import { apiGetSupervisedUsers, LinkSupervisedUser } from '../../../api/user/supervised/getSupervisedUsers'
import { UserBasicView } from '../../../components/userBasicView'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FamilyMemberOptions } from '../../../components/supervisedUsers/FamilyMemberOptions'

export default function Family() {
    const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false)
    const [loadingLinkingUser, setLoadingLinkingUser] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [supervisedUsers, setSupervisedUsers] = useState<LinkSupervisedUser[]>([])
    const [memberSelected, setMemberSelected] = useState<LinkSupervisedUser>()

    useEffect(() => {
        findSupervisedUsers()
    }, [])

    const findSupervisedUsers = async () => {
        setLoadingList(true)
        try {
            const users = await apiGetSupervisedUsers()
            setSupervisedUsers(users.data)
        } catch {
            setSupervisedUsers([])
        } finally {
            setLoadingList(false)
        }
    }

    const onScanUserQrCode = async (data: string) => {
        setOpenQrCodeScanner(false)

        if (data.includes('userLinkId')) {
            setLoadingLinkingUser(true)
            try {
                const requisicao = await apiLinkSupervisorToUser({ sharedUserCode: data.substring(11) })

                if (requisicao.status === 201) {
                    return findSupervisedUsers()
                }
            } catch (e) {
                if (e instanceof AxiosError) {
                    Alert.alert('Erro', translateMessage(e.response?.data?.message))
                    return
                }
            } finally {
                setLoadingLinkingUser(false)
            }
        }

        Alert.alert('Erro', 'QR code inválido')
    }

    return (
        <View className="flex-1 bg-stone-100">
            <FamilyMemberOptions
                member={memberSelected}
                close={() => setMemberSelected(undefined)}
                onConfirmEvent={(eventCode) => {
                    if (eventCode === 'removeLink') {
                        console.log('remover')
                    }
                }}
            />
            <ScanQrCode
                onClose={() => setOpenQrCodeScanner(false)}
                onScan={onScanUserQrCode}
                visible={openQrCodeScanner}
                description='Peça para o usuário mostrar o QR code de compartilhamento, que ele pode encontrar no perfil ao clicar em "Compartilhar"'
            />

            <Header title="Família" backButton />

            <ScrollView
                contentContainerStyle={{ paddingVertical: 20, gap: 10 }}
                refreshControl={<RefreshControl refreshing={loadingList} onRefresh={findSupervisedUsers} />}>
                <SettingContainer>
                    <View style={{ maxHeight: 200 }}>
                        <Image source={imgFamily} className="h-full w-full" contentFit="contain" />
                    </View>
                    <Text className="text-center">Você pode se conectar com seus filhos, netos ou com aqueles de quem você cuida</Text>
                    <Button text="Conectar" onPress={() => setOpenQrCodeScanner(true)} loading={loadingLinkingUser} />
                </SettingContainer>

                {supervisedUsers.length > 0 && (
                    <SettingContainer title="Membros da família">
                        {supervisedUsers.map((supervisedMember) => {
                            const {
                                supervisedUser: { id, displayName, pictureUrl, biography },
                            } = supervisedMember

                            return (
                                <TouchableOpacity
                                    key={id}
                                    onPress={() => setMemberSelected(supervisedMember)}
                                    className="flex-row items-center"
                                    style={{ gap: 4 }}>
                                    <UserBasicView title={displayName} urlPicture={pictureUrl} info={biography} />
                                    <MaterialCommunityIcons name="chevron-right" size={28} color={'#c2c2c2'} />
                                </TouchableOpacity>
                            )
                        })}
                    </SettingContainer>
                )}
            </ScrollView>
        </View>
    )
}
