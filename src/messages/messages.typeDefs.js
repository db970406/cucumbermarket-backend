/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type Message{
        id:Int!
        payload:String!
        user:User!
        room:Room!
        createdAt:String!
        updatedAt:String!
        isMine:Boolean!
        read:Boolean!
    }
    type Room{
        id:Int!
        users:[User]
        messages:[Message]
        createdAt:String!
        updatedAt:String!
        unreadCount:Int!
    }
`