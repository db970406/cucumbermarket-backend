/* 
작성자 : SJ
파일 역할 : User 모델의 Computed fields
작성일 : 2022.01.05
수정일 : 2022.01.11
*/

import client from '../client';

export default {
    User: {
        isMe: ({ id }, _, { loggedInUser }) => id === loggedInUser?.id,

        items: ({ id }) => client.user.findUnique({
            where: { id }
        }).items(),

        itemPhotos: ({ id }) => client.user.findUnique({
            where: { id }
        }).itemPhotos(),

        likes: ({ id }) => client.item.findMany({
            where: {
                likes: {
                    some: {
                        userId: id
                    }
                }
            },
        }),

        likeCount: async (_, __, { loggedInUser }) => {
            if (!loggedInUser) return 0;

            const count = await client.like.count({
                where: {
                    userId: loggedInUser.id
                }
            })
            return count
        },

        itemCount: async ({ id }) => client.item.count({
            where: {
                userId: id
            }
        })
    }
}