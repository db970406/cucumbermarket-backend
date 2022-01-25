/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.14
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Query: {
        seeRoom: checkLoginResolver(
            async (_, { roomId, userId }, { loggedInUser }) => {
                try {
                    if (roomId) {
                        return client.room.findFirst({
                            where: {
                                AND: [
                                    {
                                        id: roomId
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
                        });
                    };
                    if (userId) {
                        return client.room.findFirst({
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
                        });
                    };
                } catch {
                    return null;
                }
            }
        )
    }
}