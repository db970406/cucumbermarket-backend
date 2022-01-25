/* 
작성자 : SJ
파일 역할 : 프로젝트 내 typeDefs 파일과 resolvers 파일을 모두 합쳐서 schema로 만드는 파일
작성일 : 2022.01.04
수정일 : -----
*/

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const loadTypeDefs = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

export const typeDefs = mergeTypeDefs(loadTypeDefs);
export const resolvers = mergeResolvers(loadResolvers);
