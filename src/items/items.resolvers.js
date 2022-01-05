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

        isLiked: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id
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