/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type Query{
        seeUser(username:String!):User
    }
`