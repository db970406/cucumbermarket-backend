/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

// 선택한 물건을 보여주는 기능

import client from '../../client';

export default {
    Query: {
        seeItem: (_, { id }) => client.item.findUnique({
            where: { id }
        })
    }
}