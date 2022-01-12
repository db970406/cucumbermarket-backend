/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.12
*/

import { gql } from 'apollo-server';

export default gql`
    type Query{
        searchItems(keyword:String!):[Item]
    }
`