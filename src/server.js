/* 
작성자 : SJ
파일 역할 : 오이마켓 백엔드 메인 서버
작성일 : 2022.01.04
수정일 : 2022.01.05
*/

import "dotenv/config"
import { ApolloServer } from "apollo-server-express"
import { resolvers, typeDefs } from './apollo/schema'
import { findUser } from './apollo/users/users.utils'
import express from "express"
import morgan from "morgan"
import { createServer } from "http"
import socialRouter from './express/router/socialRouter'
import cors from "cors"

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

const app = express()
app.use(express.json())

app.use(cors());

// 소셜 로그인은 express서버를 사용해서 구현하기 위함
app.use(morgan("tiny"))
app.use("/social", socialRouter)

server.applyMiddleware({ app })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

const PORT = process.env.PORT
httpServer.listen(PORT, () => console.log(`GraphQL Server on http://localhost:${PORT}`))