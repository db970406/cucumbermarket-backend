/* 
작성자 : SJ
파일 역할 : 오이마켓 백엔드 메인 서버
작성일 : 2022.01.04
수정일 : -----
*/

import "dotenv/config"
import { ApolloServer } from "apollo-server"
import { resolvers, typeDefs } from './schema'
import { findUser } from './users/users.utils'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
        if (req) {
            return {
                loggedInUser: await findUser(req.headers.token)
            }
        } else if (connection) {
            return {
                loggedInUser: connection.context.loggedInUser
            }
        }
    },
    subscriptions: {
        onConnect: async ({ token }) => {
            if (!token) throw new Error("로그인이 필요합니다.")
            return {
                loggedInUser: await findUser(token)
            }
        }
    }
})

const PORT = process.env.PORT
server.listen(PORT, () => console.log(`GraphQL Server on http://localhost:${PORT}`))