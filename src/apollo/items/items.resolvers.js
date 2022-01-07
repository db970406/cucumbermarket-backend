/* 
작성자 : SJ
파일 역할 : Item 모델의 Computed fields
작성일 : 2022.01.05
수정일 : -----
*/

import client from '../client';

export default {
    Item: {
        user: ({ userId }) => client.user.findUnique({
            where: {
                id: userId
            }
        }),

        itemPhotos: ({ id }) => client.item.findUnique({
            where: { id }
        }).itemPhotos(),

        isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,

        likes: ({ id }) => client.user.findMany({
            where: {
                likes: {
                    some: {
                        itemId: id
                    }
                }
            }
        }),

        likeCount: ({ id }) => client.like.count({
            where: {
                itemId: id
            }
        }),

        isLiked: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) return false

            const check = await client.like.count({
                where: {
                    userId: loggedInUser.id,
                    itemId: id
                }
            })
            return Boolean(check)
        }
    },
    ItemPhoto: {
        item: ({ itemId }) => client.item.findUnique({
            where: {
                id: itemId
            }
        }),
        user: ({ userId }) => client.user.findUnique({
            where: {
                id: userId
            }
        })
    }

}