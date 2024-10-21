import { apiAuthenticated } from '../route'

interface Params {
    content: string
    images: {
        uri: string
        mimeType: string
    }[]
}

export async function apiNewUserPost({ content, images }: Params) {
    const formData = new FormData()

    formData.append('content', content)

    images.forEach(({ uri, mimeType }) => {
        // @ts-expect-error: special react native format for form data
        formData.append('files', {
            uri,
            name: 'files',
            type: mimeType,
        })
    })

    return (await apiAuthenticated()).post(`/user/posts`, formData)
}
