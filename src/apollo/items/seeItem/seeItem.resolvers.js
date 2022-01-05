/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import client from '../../client';

export default {
    Query: {
        seeItem: (_, { id }) => client.item.findUnique({
            where: { id }
        })
    }
}