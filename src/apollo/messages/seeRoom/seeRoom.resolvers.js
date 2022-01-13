/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.13
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Query: {
        seeRoom: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => client.room.findFirst({
                where: {
                    AND: [
                        {
                            users: {
                                some: {
                                    id
                                }
                            }
                        },
                        {
                            users: {
                                some: {
                                    id: loggedInUser.id
                                }
                            }
                        }
                    ]
                }
            })
        )
    }
}