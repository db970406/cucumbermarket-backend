/* 
작성자 : SJ
파일 역할 : createUser mutation 요청 시 필요한 정보와 return 타입. 이하 모든 schema 설명 같음
작성일 : 2022.01.04
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type Mutation{
        createUser(
            name:String!,
            username:String!,
            email:String!,
            password:String!,
            location:String,
        ):MutationResults!
    }
`