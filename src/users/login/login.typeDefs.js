/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type LoginResults{
        ok:Boolean!
        token:String
        error:String
    }
    type Mutation{
        login(username:String!,password:String!):LoginResults!
    }
`