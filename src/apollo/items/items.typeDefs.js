/* 
작성자 : SJ
파일 역할 : 프론트에서 서버에 요청할 수 있는 Item 필드
작성일 : 2022.01.05
수정일 : -----
*/

import { gql } from "apollo-server"

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