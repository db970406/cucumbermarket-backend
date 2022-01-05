/* 
작성자 : SJ
파일 역할 : editUser mutation 요청 시 처리하는 방법
작성일 : 2022.01.04
수정일 : -----
*/

import client from '../../client'
import bcrypt from "bcrypt"
import { checkLoginResolver } from '../users.utils'

export default {
    Mutation: {
        editUser: checkLoginResolver(
            async (
                _,
                {
                    name,
                    username,
                    email,
                    password,
                    location
                },
                {
                    loggedInUser
                }
            ) => {
                try {
                    if (username || email) {
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

                    let hashPassword = null
                    if (password) {
                        hashPassword = await bcrypt.hash(password, 10)
                    }

                    await client.user.update({
                        where: {
                            id: loggedInUser.id
                        },
                        data: {
                            name,
                            username,
                            email,
                            ...(hashPassword && { password: hashPassword }),
                            location
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