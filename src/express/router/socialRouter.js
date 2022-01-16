/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.16
*/

import express from "express"
import { githubLogin, kakaoLogin, naverLogin } from '../controller/socialController'

const socialRouter = express.Router()

socialRouter.post("/github", githubLogin)

socialRouter.post("/naver", naverLogin)

socialRouter.post("/kakao", kakaoLogin)
export default socialRouter