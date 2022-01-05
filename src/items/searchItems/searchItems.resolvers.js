/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import client from '../../client';

export default {
    Query: {
        searchItems: (_, { title }) => client.item.findMany({
            where: {
                title: {
                    startsWith: title
                }
            }
        })
    }
}