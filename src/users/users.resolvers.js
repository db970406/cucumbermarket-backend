/* 
작성자 : SJ
파일 역할 : User 모델의 Computed fields
작성일 : 2022.01.05
수정일 : -----
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
        }).itemPhotos()
    }
}