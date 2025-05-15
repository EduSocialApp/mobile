import { Platform } from 'react-native'
import { apiAuthenticated } from '../route'

//content, startDate, endDate, level, notifiedUsers, title
interface Params {
    organizationId: string
    content: string
    images: {
        uri: string
        mimeType: string
    }[]
    level: string
    title: string
    startDate?: Date
    endDate?: Date
    addressId?: string
}

export async function apiNewOrganizationPost({ organizationId, content, images, level, title, startDate, endDate, addressId }: Params) {
    const formData = new FormData()

    formData.append('content', content)
    formData.append('level', level)
    formData.append('title', title)

    if (startDate) {
        formData.append('startDate', startDate.toISOString())
    }

    if (endDate) {
        formData.append('endDate', endDate.toISOString())
    }

    if (addressId) {
        formData.append('addressId', addressId)
    }

    images.forEach(({ uri, mimeType }) => {
        // @ts-expect-error: special react native format for form data
        formData.append('files', {
            uri,
            name: 'files',
            type: mimeType,
        })
    })

    return (await apiAuthenticated()).post(
        `/org/${organizationId}/posts`,
        formData,
        Platform.OS === 'android'
            ? {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              }
            : undefined
    )
}
