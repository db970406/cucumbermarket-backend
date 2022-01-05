/* 
작성자 : SJ
파일 역할 : 프론트에서 서버에 요청할 수 있는 User 필드
작성일 : 2022.01.04
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type User{
        id:Int!
        name:String!
        email:String!
        username:String!
        location:String
        createdAt:String!
        updatedAt:String!
    }
`