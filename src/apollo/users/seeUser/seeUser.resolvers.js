/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : 2022.01.08
*/

// 클릭한 유저의 정보를 볼 수 있게 하는 기능

import client from '../../client';

export default {
    Query: {
        seeUser: (_, { id }) => client.user.findUnique({
            where: { id }
        })
    }
}