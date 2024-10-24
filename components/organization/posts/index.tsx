import { View, Text, TouchableOpacity } from 'react-native'
import { Post } from '../../../api/user/getUserFeed'
import { ListPosts } from '../../posts/ListPosts'
import { useState } from 'react'
import { NewUserPostModal } from '../../posts/modals/newUserPost'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export function OrganizationPosts() {
    // gere uma lista com 1000 posicoes
    const list: Post[] = Array.from({ length: 50 }, (_, i) => ({
        id: String(i),
        title: `Post ${i}`,
        content: `Conteudo do post ${i}`,
        likesCount: 0,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        user: {
            id: '01926c74-723e-7004-9449-74dac3c3609d',
            name: 'Felipe Vieira Sobral',
            displayName: 'Felipe',
            pictureUrl: 'https://edusocial-medias.s3.amazonaws.com/0192970d-af7b-7884-99c5-b82b1b94a1bb.jpeg',
        },
        medias: [],
        likes: [],
    }))

    return (
        <View className="flex-1 bg-white relative">
            <ListPosts posts={list} loading={false} onRefresh={() => {}} />
        </View>
    )
}
