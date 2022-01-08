/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : 2022.01.05
*/

import client from '../../client'
import { checkLoginResolver, pwStandard } from '../users.utils'
import { uploadToAWS } from "../../public/public.utils"

export default {
    Mutation: {
        editUser: checkLoginResolver(
            async (
                _,
                {
                    name,
                    location,
                    introduce,
                    avatar
                },
                {
                    loggedInUser
                }
            ) => {
                try {
                    /* if (username || email) {
                        const isAlreadyTaken = await client.user.count({
                            where: {
                                OR: [
                                    { username },
                                    { email }
                                ],
                                id: {
                                    not: loggedInUser.id
                                }
                            }
                        })
                        if (isAlreadyTaken) throw new Error("이미 존재하는 유저명 혹은 이메일입니다.")
                    }

                    let filterPassword = null
                    if (password) {
                        filterPassword = await pwStandard(password)
                    } */

                    let avatarUrl = null
                    if (avatar.length !== 0) {
                        avatarUrl = await uploadToAWS(avatar, loggedInUser.id, "avatars")
                    }

                    await client.user.update({
                        where: {
                            id: loggedInUser.id
                        },
                        data: {
                            name,
                            /* username,
                            email,
                            ...(filterPassword && { password: filterPassword }), */
                            location,
                            introduce,
                            ...(avatarUrl && { avatar: avatarUrl })
                        }
                    })

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