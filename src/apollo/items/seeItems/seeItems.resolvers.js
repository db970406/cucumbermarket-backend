/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.07
*/

// 메인 Home에 쓰이는 기능으로 생성된 날짜 별로 물건을 가져오는 기능

import client from '../../client';

export default {
    Query: {
        seeItems: () => client.item.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    }
}
