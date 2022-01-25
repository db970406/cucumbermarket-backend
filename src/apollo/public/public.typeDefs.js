/* 
작성자 : SJ
파일 역할 : 모든 operation에서 공유하여 사용하는 return 타입
작성일 : 2022.01.04
수정일 : -----
*/

import { gql } from 'apollo-server';

export default gql`
    type MutationResults{
        ok:Boolean!
        error:String
    }
`;