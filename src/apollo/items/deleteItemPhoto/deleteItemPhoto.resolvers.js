/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.10
*/

// 물건에 속한 사진의 소유자인지 확인하고 남아 있는 사진이 1장이 아니라면 사진 하나를 삭제하는 기능

import client from '../../client';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        deleteItemPhoto: checkLoginResolver(
            async (_, { id }, { loggedInUser }) => {
                try {
                    const itemPhoto = await client.itemPhoto.findUnique({
                        where: { id },
                        include: {
                            item: {
                                select: {
                                    itemPhotos: true
                                }
                            }
                        }
                    });
                    if (!itemPhoto) throw new Error("없는 사진입니다.");
                    else if (itemPhoto.userId !== loggedInUser.id) throw new Error("삭제 권한이 없습니다.");
                    else if (itemPhoto.item.itemPhotos.length === 1) throw new Error("사진을 더 이상 삭제할 수 없습니다");
                    else {
                        await client.itemPhoto.delete({
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