/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : -----
*/

import client from '../../client';
import { checkLoginResolver } from '../users.utils';

// 현재 로그인한 유저의 정보를 넘겨줄 resolver
export default {
    Query: {
        seeLoggedInUser: checkLoginResolver(
            async (_, __, { loggedInUser }) => client.user.findUnique({
                where: {
                    id: loggedInUser.id
                }
            })
        )
    }
}