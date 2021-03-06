/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.19
*/

// User 모델의 Computed fields

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

        likeCount: async ({ id }) => {
            const count = await client.like.count({
                where: {
                    userId: id
                }
            });
            return count;
        },

        itemCount: ({ id }) => client.item.count({
            where: {
                userId: id
            }
        })
    }
}