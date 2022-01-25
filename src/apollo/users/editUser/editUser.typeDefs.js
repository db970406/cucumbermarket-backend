/* 
작성자 : SJ
작성일 : 2022.01.04
수정일 : 2022.01.05
*/

import { gql } from 'apollo-server';

export default gql`
    type Mutation{
        editUser(
            name:String,
            location:String,
            introduce:String,
            avatar:Upload
        ):MutationResults!
    }
`;