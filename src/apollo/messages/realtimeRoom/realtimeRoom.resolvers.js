/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : -----
*/

// subscription operator를 통해 해당 방의 trigger를 감지한다.

import { withFilter } from 'apollo-server';
import client from '../../client';
import pubsub from '../../pubsub';
import { NEW_MESSAGE } from '../../trigger';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Subscription: {
        realtimeRoom: {
            subscribe: checkLoginResolver(
                async (root, args, ctx, info) => {

                    // 입장하려는 방이 내가 있는 방인지 확인
                    const room = await client.room.findFirst({
                        where: {
                            id: args.id,
                            users: {
                                some: {
                                    id: ctx.loggedInUser.id
                                }
                            }
                        }
                    });
                    if (!room) throw new Error("찾을 수 없는 방입니다");

                    /*
                    NEW_MESSAGE를 pubsub의 trigger로 설정하고 trigger가 감지되면 
                    입장해있는 room의 id와 message를 send한 방의 id가 일치하는지 확인하여 맞다면 메시지를 방에 보낸다.
                    */
                    return withFilter(
                        () => pubsub.asyncIterator(NEW_MESSAGE),
                        (payload, variables) => payload.realtimeRoom.roomId === variables.id
                    )(root, args, ctx, info);
                }
            )
        }
    }
}