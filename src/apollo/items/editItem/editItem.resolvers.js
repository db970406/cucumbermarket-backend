/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.10
*/

import client from '../../client';
import { uploadToAWS } from '../../public/public.utils';
import { checkLoginResolver } from '../../users/users.utils';

export default {
    Mutation: {
        editItem: checkLoginResolver(
            async (_, { id, file, title, description }, { loggedInUser }) => {
                try {
                    const item = await client.item.findUnique({
                        where: { id },
                        select: {
                            userId: true
                        }
                    })
                    if (!item) throw new Error("없는 물건입니다.")
                    else if (item.userId !== loggedInUser.id) throw new Error("수정 권한이 없습니다.")
                    else {
                        const item = await client.item.update({
                            where: {
                                id
                            },
                            data: {
                                title,
                                description
                            }
                        })

                        let fileUrl;
                        if (file) {
                            fileUrl = await uploadToAWS(file, loggedInUser.id, "itemPhotos")
                            await client.itemPhoto.create({
                                data: {
                                    user: {
                                        connect: {
                                            id: loggedInUser.id
                                        }
                                    },
                                    item: {
                                        connect: {
                                            id: item.id
                                        }
                                    },
                                    file: fileUrl
                                }
                            })
                        }
                        return item
                    }
                } catch {
                    return null
                }
            }
        )
    }
}