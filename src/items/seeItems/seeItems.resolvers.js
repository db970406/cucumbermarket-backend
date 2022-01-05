/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import client from '../../client';

/*
로그인한 유저가 location을 설정했다면 동네 기준으로 찾아주고
location을 설정하지 않았거나 비로그인 유저라면 DB에 있는 Item 전부를 보여줄 것이다.
*/
export default {
    Query: {
        seeItems: (_, __, { loggedInUser }) => loggedInUser?.location ? (
            client.item.findMany({
                where: {
                    user: {
                        location: loggedInUser.location
                    }
                }
            })
        ) : (
            client.item.findMany()
        )
    }
}
