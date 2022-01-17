# Cucumber Market - Backend
- 2022.01.04 ~ 2022.01.17
- [데모]

# 1. 개발 목표
## 1) 기술 숙달
- 백엔드와 React가 상호작용하는 절차를 직접 프로젝트를 함으로 체험
- GraphQL의 3가지 Operator인 Query, Mutation, Subscription의 숙달
- GraphQL 툴 중 가장 유명한 Apollo의 기술인 Self-Reference, Computed Fields 등 숙달
- 소셜 로그인, 위치 제공 등 유명 기업의 공유 API 사용법 숙달
## 2) 웹의 흐름 이해
- 프론트엔드 <-> 백엔드의 흐름 이해 및 현재 보유한 지식의 실무 활용을 위해 총동원하여 풀스택 프로젝트 개발

# 2. 사용 기술
- NodeJS
- Apollo(GraphQL)
- Express
- Prisma
- AWS(S3)

# 3. 데이터 모델별 기능
## 공통
- 현재 로그인한 상태의 유저인지 체크하는 checkLoginResolver를 이중함수로 사용
- User의 avatar, Item의 itemPhoto는 AWS S3에 저장
- edit, delete 관련 Resolver들은 checkLoginResolver를 1차 보안으로, 본인이 맞는지 확인하는 2차 절차를 거쳤음
## 1) User 관련
- CRU(D는 제외) 구현
- bcrypt를 이용한 비밀번호 해싱
- JWT토큰을 이용한 Authorization
- 소셜 로그인(Express)
- AWS 저장소를 이용하여 아바타 이미지 저장
- seeLoggedInUser : 현재 로그인한 유저의 정보

## 2) Item 관련
- CRUD 구현
- deleteItemPhoto : Item에 속한 특정 사진을 삭제할 수 있음
- searchItems : 제목, 설명, 동네를 키워드로 값을 찾음
- toggleLike : 관심 기능을 toggle형태로 구현

## 3) Message + Room 관련
- CRUD 구현
- 메시지를 개별로 지우는 기능은 미구현
- 대신 deleteRoom으로 해당 Room에 아무도 존재하지 않게 되면 Room을 삭제시켜 그 Room에 속해 있는 Message들을 자동 삭제되게 하였음
- Subscription Operator로 실시간 메시지 구현
- 해당 Room에 속한 유저만이 그 Room에 메시지를 보낼 수 있게 하였다.

