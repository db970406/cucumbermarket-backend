/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : -----
*/

// 내가 속해있는 방을 모두 보여주는 기능

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';


export default {
    Query: {
        seeRooms: checkLoginResolver(
            async (_, __, { loggedInUser }) => client.room.findMany({
                where: {
                    users: {
                        some: {
                            id: loggedInUser.id
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        )
    }
}