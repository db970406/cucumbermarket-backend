/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import client from '../../client'
import { uploadToAWS } from '../../public/public.utils'
import { checkLoginResolver } from '../../users/users.utils'

export default {
    Mutation: {
        uploadItem: checkLoginResolver(
            async (_, { title, description, file }, { loggedInUser }) => {
                try {

                    const item = await client.item.create({
                        data: {
                            title,
                            description,
                            user: {
                                connect: {
                                    id: loggedInUser.id
                                }
                            }
                        }
                    })

                    const fileUrl = await uploadToAWS(file, loggedInUser.id, "itemPhotos")

                    await client.itemPhoto.create({
                        data: {
                            file: fileUrl,
                            user: {
                                connect: {
                                    id: loggedInUser.id
                                }
                            },
                            item: {
                                connect: {
                                    id: item.id
                                }
                            }
                        }
                    })

                    return item
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