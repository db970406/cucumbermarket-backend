/* 
작성자 : SJ
파일 역할 : AWS S3저장소에 이미지를 업로드하는 파일
작성일 : 2022.01.05
수정일 : 2022.01.12
*/

import AWS from "aws-sdk"

// AWS 접근 키 세팅
AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
    }
})

// AWS S3 저장소에 이미지 저장하고 URL을 return
export const uploadToAWS = async (file, userId, folderName) => {
    const { filename, createReadStream } = await file
    // AWS S3저장소에 겹치는 이미지 파일명이 최대한 겹치지 않게끔 한다.
    const newFilename = `${folderName}/${userId}-${Date.now()}-${filename}`
    const upload = await new AWS.S3().upload({
        Bucket: "cucumbermarket-upload",
        Key: newFilename,
        Body: createReadStream(),
        ACL: "public-read"
    }).promise()

    return upload?.Location
}