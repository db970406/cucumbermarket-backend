/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : 2022.01.08
*/

import client from '../../client';

export default {
    Query: {
        seeUser: (_, { id }) => client.user.findUnique({
            where: { id }
        })
    }
}