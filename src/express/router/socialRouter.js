/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import express from "express"
import { githubStart, githubFinish } from '../controller/socialController'

const socialRouter = express.Router()

socialRouter.get("/github/start", githubStart)
socialRouter.get("/github/finish", githubFinish)
export default socialRouter