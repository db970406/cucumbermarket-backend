/* 
작성자 : SJ
파일 역할 : seeUser query 요청 시 필요한 정보와 return 타입
작성일 : 2022.01.04
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type Query{
        seeUser(username:String!):User
    }
`