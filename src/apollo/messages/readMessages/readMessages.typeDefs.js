/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type Mutation{
        readMessages(id:Int!):MutationResults!
    }
`;