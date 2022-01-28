/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.10
*/

import { gql } from "apollo-server";

export default gql`
    type Item{
        id:Int!
        title:String!
        description:String
        user:User!
        itemPhotos:[ItemPhoto]
        createdAt:String!
        updatedAt:String!
        isMine:Boolean!
        likes:[User]
        likeCount:Int!
        isLiked:Boolean!
        itemPhotoCount:Int!
    }
    type ItemPhoto{
        id:Int!
        file:String!
        item:Item!
        user:User!
        createdAt:String!
        updatedAt:String!
    }
`