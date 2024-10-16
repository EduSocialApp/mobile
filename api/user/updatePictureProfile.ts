import { apiAuthenticated } from '../route'

interface Params {
    id: string
    uri: string
    mimeType: string
}

//Exemplo: https://github.com/expo/image-upload-example/blob/master/app/index.tsx

export async function apiUpdatePictureProfile({ id, uri, mimeType }: Params) {
    try {
        const formData = new FormData()

        // @ts-expect-error: special react native format for form data
        formData.append('file', {
            uri,
            name: 'file',
            type: mimeType,
        })

        const result = await (await apiAuthenticated()).patch(`/user/${id}/profilePicture`, formData)

        if (!result) throw new Error('No result')

        if (result.status !== 200) throw new Error('Error')

        return true
    } catch {
        return false
    }
}
