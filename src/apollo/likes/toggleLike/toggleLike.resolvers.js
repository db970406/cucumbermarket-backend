/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        toggleLike: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const item = await client.item.count({
                        where: { id }
                    })
                    if (!item) throw new Error("없는 물건입니다.")

                    const isLike = await client.like.count({
                        where: {
                            itemId: id,
                            userId: loggedInUser.id
                        }
                    })
                    if (isLike) {
                        await client.like.delete({
                            where: {
                                userId_itemId: {
                                    userId: loggedInUser.id,
                                    itemId: id,
                                }
                            }
                        })
                    } else {
                        await client.like.create({
                            data: {
                                item: {
                                    connect: {
                                        id
                                    }
                                },
                                user: {
                                    connect: {
                                        id: loggedInUser.id
                                    }
                                }
                            }
                        })
                    }

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