/* 
작성자 : SJ
파일 역할 : 서버와 DB를 오갈 PrismaClient를 파일화하여 import로 사용할 예정
작성일 : 2022.01.04
수정일 : -----
*/

import { PrismaClient } from "../node_modules/@prisma/client"

const client = new PrismaClient()

export default client