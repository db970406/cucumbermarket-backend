/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : -----
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        readMessages: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const room = await client.room.count({
                        where: {
                            id,
                            users: {
                                some: {
                                    id: loggedInUser.id
                                }
                            }
                        }
                    })
                    if (!room) throw new Error("없는 방입니다.")

                    await client.message.updateMany({
                        where: {
                            roomId: id,
                            room: {
                                users: {
                                    some: {
                                        id: loggedInUser.id
                                    }
                                }
                            },
                            userId: {
                                not: loggedInUser.id
                            },
                            read: false
                        },
                        data: {
                            read: true
                        }
                    })
                    return {
                        ok: true
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    }
                }
            }
        )
    }
}