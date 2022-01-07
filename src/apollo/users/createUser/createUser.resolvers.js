/* 
작성자 : SJ
파일 역할 : createUser mutation 요청 시 처리하는 방법. 이하 모든 resolver 설명 같음
작성일 : 2022.01.04
수정일 : -----
*/

import client from "../../client"
import { pwStandard } from '../users.utils'

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

                const filterPassword = await pwStandard(password)

                // 가입 시 기본적으로 세팅되는 avatar
                const defaultAvatar = "https://cucumbermarket-upload.s3.ap-northeast-2.amazonaws.com/avatars/no-profile-picture.png"

                await client.user.create({
                    data: {
                        name,
                        username: username.toLowerCase(),
                        email,
                        password: filterPassword,
                        location,
                        avatar: defaultAvatar
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