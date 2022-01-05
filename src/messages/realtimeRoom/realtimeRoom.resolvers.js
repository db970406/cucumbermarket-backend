/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : -----
*/

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
                    const room = await client.room.findFirst({
                        where: {
                            id: args.id,
                            users: {
                                some: {
                                    id: ctx.loggedInUser.id
                                }
                            }
                        }
                    })
                    if (!room) throw new Error("찾을 수 없는 방입니다")

                    return withFilter(
                        () => pubsub.asyncIterator(NEW_MESSAGE),
                        (payload, variables) => payload.realtimeRoom.roomId === variables.id
                    )(root, args, ctx, info)
                }
            )
        }
    }
}