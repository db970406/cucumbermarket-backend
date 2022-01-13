/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.13
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';
import pubsub from '../../pubsub';
import { NEW_MESSAGE } from '../../trigger';

export default {
    Mutation: {
        createMessage: checkLoginResolver(
            async (_, { payload, roomId, userId }, { loggedInUser }) => {
                try {
                    let room = null
                    if (userId) {
                        const user = await client.user.count({
                            where: {
                                id: userId
                            }
                        })
                        if (!user) return null

                        const checkRoom = await client.room.findFirst({
                            where: {
                                AND: [
                                    {
                                        users: {
                                            some: {
                                                id: userId
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
                        if (checkRoom) {
                            room = checkRoom
                        } else {
                            room = await client.room.create({
                                data: {
                                    users: {
                                        connect: [
                                            {
                                                id: userId
                                            },
                                            {
                                                id: loggedInUser.id
                                            }
                                        ]
                                    }
                                }
                            })
                        }
                    } else if (roomId) {
                        room = await client.room.findFirst({
                            where: {
                                id: roomId,
                                users: {
                                    some: {
                                        id: loggedInUser.id
                                    }
                                }
                            }
                        })
                    }
                    const message = await client.message.create({
                        data: {
                            payload,
                            user: {
                                connect: {
                                    id: loggedInUser.id
                                }
                            },
                            room: {
                                connect: {
                                    id: room.id
                                }
                            }
                        }
                    })
                    pubsub.publish(NEW_MESSAGE, { realtimeRoom: { ...message } })
                    return message
                } catch {
                    return null
                }
            }
        )
    }
}