/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        deleteItem: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const item = await client.item.findUnique({
                        where: { id },
                        select: {
                            userId: true
                        }
                    })
                    if (!item) throw new Error("없는 물건입니다.")
                    else if (item.userId !== loggedInUser.id) throw new Error("삭제 권한이 없습니다.")
                    else {
                        await client.item.delete({
                            where: {
                                id
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