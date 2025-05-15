import { Text, View, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native'
import { Header } from '../../../components/header'
import { Button } from '../../../components'
import { SettingContainer } from '../../../components/settingContainer'
import { ScanQrCode } from '../../../components/modals/scanQrcode'
import { useEffect, useRef, useState } from 'react'
import { apiLinkSupervisorToUser } from '../../../api/user/supervised/linkSupervisorToUser'
import { AxiosError } from 'axios'
import { translateMessage } from '../../../translate/translateMessage'
import { apiGetSupervisedUsers, LinkSupervisedUser } from '../../../api/user/supervised/getSupervisedUsers'
import { UserView } from '../../../components/userView'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FamilyMemberOptions } from '../../../components/supervisedUsers/FamilyMemberOptions'
import SafeView from '../../../components/safeView'

export default function Family() {
    const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false)
    const [loadingLinkingUser, setLoadingLinkingUser] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [supervisedUsers, setSupervisedUsers] = useState<LinkSupervisedUser[]>([])
    const [memberSelected, setMemberSelected] = useState<LinkSupervisedUser>()

    const proccessingQrCode = useRef(false)

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
        if (proccessingQrCode.current) return

        proccessingQrCode.current = true
        setOpenQrCodeScanner(false)

        if (data.includes('userLinkId')) {
            setLoadingLinkingUser(true)
            try {
                const requisicao = await apiLinkSupervisorToUser({ sharedUserCode: data.substring(11) })

                if (requisicao.status === 201) {
                    await findSupervisedUsers()
                }
            } catch (e) {
                if (e instanceof AxiosError) {
                    Alert.alert('Erro', translateMessage(e.response?.data?.message))
                }
            } finally {
                setLoadingLinkingUser(false)
            }
        } else {
            Alert.alert('Erro', 'QR code inválido')
        }

        proccessingQrCode.current = false
    }

    return (
        <SafeView className="bg-white">
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
                className="bg-stone-100"
                contentContainerStyle={{ paddingVertical: 20, gap: 10 }}
                refreshControl={<RefreshControl refreshing={loadingList} onRefresh={findSupervisedUsers} />}>
                <SettingContainer>
                    <View style={{ gap: 8 }}>
                        <Button text="Conectar" onPress={() => setOpenQrCodeScanner(true)} loading={loadingLinkingUser} />
                        <Text className="text-center text-stone-600">
                            Você pode se conectar com seus filhos, netos ou com aqueles de quem você cuida
                        </Text>
                    </View>
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
                                    <UserView title={displayName} urlPicture={pictureUrl} info={biography} />
                                    <MaterialCommunityIcons name="chevron-right" size={28} color={'#c2c2c2'} />
                                </TouchableOpacity>
                            )
                        })}
                    </SettingContainer>
                )}
            </ScrollView>
        </SafeView>
    )
}
