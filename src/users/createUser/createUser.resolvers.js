/* 
작성자 : SJ
파일 역할 : createUser mutation 요청 시 처리하는 방법
작성일 : 2022.01.04
수정일 : -----
*/

import client from "../../client"
import bcrypt from "bcrypt"

export default {
    Mutation: {
        createUser: async (_, { name, username, email, password, location }) => {
            try {
                const isAlreadyTaken = await client.user.count({
                    where: {
                        OR: [
                            { username },
                            { email }
                        ]
                    }
                })
                if (isAlreadyTaken) throw new Error("이미 존재하는 유저명 혹은 이메일입니다.")

                const hashPassword = await bcrypt.hash(password, 10)

                await client.user.create({
                    data: {
                        name,
                        username: username.toLowerCase(),
                        email,
                        password: hashPassword,
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
    }
}