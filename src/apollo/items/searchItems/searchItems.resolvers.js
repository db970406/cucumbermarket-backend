/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.12
*/

// 제목, 동네, 설명을 키워드로 하여금 검색 결과를 모두 찾아주는 기능

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