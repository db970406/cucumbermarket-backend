/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : -----
*/

// username과 email이 존재하는 지 확인한 다음 계정을 만든다.

import client from "../../client";
import { pwStandard } from '../users.utils';

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
                });
                if (isAlreadyTaken) throw new Error("이미 존재하는 유저명 혹은 이메일입니다.");

                const filterPassword = await pwStandard(password);

                await client.user.create({
                    data: {
                        name,
                        username: username.toLowerCase(),
                        email,
                        password: filterPassword,
                        location
                    }
                });

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
    }
}