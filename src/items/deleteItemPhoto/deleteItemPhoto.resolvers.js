/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        deleteItemPhoto: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const itemPhoto = await client.itemPhoto.findUnique({
                        where: { id },
                        select: {
                            userId: true
                        }
                    })
                    if (!itemPhoto) throw new Error("없는 사진입니다.")
                    else if (itemPhoto.userId !== loggedInUser.id) throw new Error("삭제 권한이 없습니다.")
                    else {
                        await client.itemPhoto.delete({
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