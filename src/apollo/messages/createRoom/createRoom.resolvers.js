/* 
작성자 : SJ
작성일 : 2022.01.15
수정일 : 2022.01.16
*/

/**
 * 대화할 유저와의 방이 있는 지 확인하고 있다면 그 방을, 없다면 새로 방을 만들어준다.
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
                    });
                    if (!user) return null;

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
                        },
                        include: {
                            messages: true
                        }
                    });
                    if (room) return room;
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
                        });
                    }
                } catch {
                    return null;
                }
            }
        )
    }
}