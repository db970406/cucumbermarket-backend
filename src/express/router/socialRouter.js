/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.12
*/

import express from "express"
import { githubLogin, naverLogin } from '../controller/socialController'

const socialRouter = express.Router()

socialRouter.post("/github", githubLogin)

socialRouter.post("/naver", naverLogin)
export default socialRouter