/* 
작성자 : SJ
작성일 : 2022.01.15
수정일 : ------
*/

/**
 * 로그인한 유저가 방에서 나갈 수 있게하는 기능으로 만약 방에 아무도 없게 된다면 그 방을 DB에서 삭제시킨다.
 */

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        deleteRoom: checkLoginResolver(
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
                    });
                    if (!room) throw new Error("없는 방입니다");

                    await client.room.update({
                        where: {
                            id
                        },
                        data: {
                            users: {
                                disconnect: [
                                    {
                                        id: loggedInUser.id
                                    }
                                ]
                            }
                        }
                    });

                    const checkRoomUser = await client.user.count({
                        where: {
                            rooms: {
                                some: {
                                    id
                                }
                            }
                        }
                    });

                    if (!checkRoomUser) {
                        await client.room.delete({
                            where: {
                                id
                            }
                        });
                    };
                    return {
                        ok: true
                    };
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    };
                }
            }
        )
    }
}