/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.10
*/

import { gql } from "apollo-server";

export default gql`
    type Mutation{
        editItem(
            id:Int!
            file:Upload
            title:String
            description:String
        ):Item
    }
`;