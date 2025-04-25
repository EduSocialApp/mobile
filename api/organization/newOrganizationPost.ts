import { apiAuthenticated } from '../route'

interface Params {
    organizationId: string
    content: string
    images: {
        uri: string
        mimeType: string
    }[]
}

export async function apiNewOrganizationPost({ organizationId, content, images }: Params) {
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

    return (await apiAuthenticated()).post(`/org/${organizationId}/posts`, formData)
}
