/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : -----
*/

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
                }
            })
        )
    }
}