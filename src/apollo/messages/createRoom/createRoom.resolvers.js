/* 
작성자 : SJ
작성일 : 2022.01.15
수정일 : ------
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        createRoom: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const user = await client.user.count({
                        where: { id }
                    })
                    if (!user) return null

                    const room = await client.room.findFirst({
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
                    if (room) return room
                    else {
                        return client.room.create({
                            data: {
                                users: {
                                    connect: [
                                        {
                                            id
                                        },
                                        {
                                            id: loggedInUser.id
                                        }
                                    ]
                                }
                            }
                        })
                    }
                } catch {
                    return null
                }
            }
        )
    }
}