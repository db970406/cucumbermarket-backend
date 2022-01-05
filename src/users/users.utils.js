/* 
작성자 : SJ
파일 역할 : 인가가 필요한 resolver에 쓰이는 유틸 함수들을 모아놓은 파일
작성일 : 2022.01.04
수정일 : -----
*/

import client from '../client'
import jwt from "jsonwebtoken"

/* 
서버가 요청을 받을 때 브라우저에게 토큰을 받아 
모든 resolvers에게 context로 user데이터를 제공하기 위해 
토큰을 받아 user를 찾아주는 함수
*/
export const findUser = async (token) => {
    try {
        if (!token) return null
        const { id } = await jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        const user = await client.user.findUnique({ where: { id } })

        return user ? user : null
    } catch {
        return null
    }
}


/* 
인가가 필요한 resolver를 사용하려고 할 때 로그인이 되어있는지 체크하는 함수
*/
export const checkLoginResolver = (resolver) => (root, args, ctx, info) => {
    if (!ctx.loggedInUser) {
        if (info.operation.operation === "query") {
            return null
        }
        return {
            ok: false,
            error: "로그인이 필요합니다."
        }
    }
    return resolver(root, args, ctx, info)
}
