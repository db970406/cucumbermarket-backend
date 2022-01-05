/* 
작성자 : SJ
파일 역할 : login mutation 요청 시 처리하는 방법
작성일 : 2022.01.04
수정일 : -----
*/

import bcrypt from "bcrypt"
import client from '../../client'
import jwt from "jsonwebtoken"

export default {
    Mutation: {
        login: async (_, { username, password }) => {
            try {
                const user = await client.user.findUnique({
                    where: { username }
                })
                if (!user) throw new Error("존재하지 않는 유저입니다")

                const pwCheck = await bcrypt.compare(password, user.password)
                if (!pwCheck) throw new Error("잘못된 비밀번호입니다.")

                // jwt토큰을 만들어서 인가(Authorization)에 쓸 것이다.
                const token = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY)

                return {
                    ok: true,
                    token
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