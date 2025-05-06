import { Post } from '../api/user/getUserFeed'

export function postsToEventGroup(posts: Post[]): EventGroup[] {
    const eventGroups: EventGroup[] = []

    posts.forEach((post) => {
        if (!post.startDate) return

        const startDate = new Date(post.startDate)

        // Cria estrutura do evento
        const postEvent: PostEvent = {
            title: post.title,
            description: post.content,
            start: startDate,
            end: post.endDate ? new Date(post.endDate) : undefined,
            level: post.level,
            postId: post.id,
            organization: {
                id: post.organization?.id || '',
                name: post.organization?.name || '',
                displayName: post.organization?.displayName || '',
                pictureUrl: post.organization?.pictureUrl || '',
                verified: post.organization?.verified || false,
            },
            membersFamilyNotified: [],
        }

        // Verifica se mes e ano já estao na lista
        const eventGroup = eventGroups.find((group) => group.year === startDate.getFullYear() && group.month === startDate.getMonth())

        if (eventGroup) {
            // Se ja estiver, verifica se o dia ja existe no eventGroup
            const eventDay = eventGroup.days.find((day) => day.day === startDate.getDate())

            if (eventDay) {
                // Adiciona apenas o post
                eventDay.events.push(postEvent)
            } else {
                // Se não existir, cria um novo dia
                eventGroup.days.push({
                    day: startDate.getDate(),
                    events: [postEvent],
                })
            }
        } else {
            eventGroups.push({
                month: startDate.getMonth(),
                year: startDate.getFullYear(),
                days: [
                    {
                        day: startDate.getDate(),
                        events: [postEvent],
                    },
                ],
            })
        }
    })

    return eventGroups
}
