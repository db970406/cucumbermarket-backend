/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.19
*/

// 물건의 id와 유저의 id로 이미 like가 있는지 체크하여 토글로 해당 유저가 하나의 물건에 하나의 like만 누를 수 있게 함

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        toggleLike: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const isExistItem = await client.item.count({
                        where: { id }
                    });
                    if (!isExistItem) throw new Error("없는 물건입니다.");

                    const isLike = await client.like.count({
                        where: {
                            itemId: id,
                            userId: loggedInUser.id
                        }
                    });

                    if (isLike) {
                        await client.like.delete({
                            where: {
                                userId_itemId: {
                                    userId: loggedInUser.id,
                                    itemId: id,
                                }
                            }
                        });
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
                        });
                    }

                    const item = await client.item.findUnique({
                        where: { id }
                    });
                    return item;
                } catch {
                    return null;
                }
            }
        )
    }
}