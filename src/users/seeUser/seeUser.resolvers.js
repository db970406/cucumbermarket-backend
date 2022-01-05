/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : -----
*/

import client from '../../client';

export default {
    Query: {
        seeUser: (_, { username }) => client.user.findUnique({
            where: { username }
        })
    }
}