/* 
작성자 : SJ
파일 역할 : seeUser query 요청 시 return할 데이터
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