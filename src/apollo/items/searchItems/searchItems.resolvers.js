/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.12
*/

import client from '../../client';

export default {
    Query: {
        searchItems: (_, { keyword }) => client.item.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: keyword
                        },
                    },
                    {
                        user: {
                            location: {
                                contains: keyword
                            }
                        },
                    },
                    {
                        description: {
                            contains: keyword
                        }
                    }
                ]
            }
        })
    }
}