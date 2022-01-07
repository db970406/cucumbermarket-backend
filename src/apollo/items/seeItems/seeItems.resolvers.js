/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.07
*/

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
