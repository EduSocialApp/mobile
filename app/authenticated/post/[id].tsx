import { useLocalSearchParams } from 'expo-router'
import { PostPage } from '../../../components/posts/post'

export default function PostView() {
    const { id } = useLocalSearchParams()

    return <PostPage id={id as string} />
}
