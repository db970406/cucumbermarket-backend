/* 
작성자 : SJ
파일 역할 : 인가에 활용될 resolver에 쓰이는 유틸 함수들을 모아놓은 파일
작성일 : 2022.01.04
수정일 : 2022.01.07
*/

import client from '../client'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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
        const { returnType, parentType, operation } = info

        // 로그인이 필요한 resolver가 mutation operation이지만 model을 반환할 경우
        if (returnType !== "MutationResults" && String(parentType) === "Mutation") {
            return null
        }

        // 로그인이 필요한 resolver가 query operation의 경우 null을 return
        if (operation.operation === "query") {
            return null
        }
        return {
            ok: false,
            error: "로그인이 필요합니다."
        }
    }
    return resolver(root, args, ctx, info)
}

// 비밀번호 조건
export const pwStandard = async (password) => {
    const regExpPassword = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/.test(password)
    if (!regExpPassword) throw new Error("비밀번호는 8자리 이상으로 숫자, 문자, 특수문자가 필요합니다.")

    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}