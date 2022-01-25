/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : -----
*/

import client from '../client';

export default {
    Message: {
        isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
        user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
        room: ({ roomId }) => client.room.findUnique({ where: { id: roomId } })
    },
    Room: {
        users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
        messages: ({ id }, { offset }) => client.message.findMany({
            where: {
                roomId: id
            },
            take: offset >= 0 ? 6 : undefined,
            skip: offset >= 0 ? offset : undefined,
        }),
        unreadCount: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) return 0;

            // 내가 입장해있는 방에 메시지 중 read가 false이면서 내 메시지가 아닌 것의 개수를 센다.
            const count = await client.message.count({
                where: {
                    roomId: id,
                    read: false,
                    room: {
                        users: {
                            some: {
                                id: loggedInUser.id
                            }
                        }
                    },
                    userId: {
                        not: loggedInUser.id
                    }
                }
            });
            return count;
        }
    }
}