/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.13
*/

import fetch from "node-fetch"
import client from '../../apollo/client'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// 깃허브, 네이버 소셜로그인 구현

//https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
export const githubLogin = async (req, res) => {
    const { code } = req.body

    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.SOCIAL_GITHUB_KEY,
        client_secret: process.env.SOCIAL_GITHUB_SECRET,
        code
    }
    const params = new URLSearchParams(config).toString()

    const reqUrl = `${baseUrl}?${params}`
    const token = await (
        await fetch(reqUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json()

    if ("access_token" in token) {
        const { access_token } = token
        console.log("access_ : ", access_token)
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json()
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json()
        console.log(userData)
        console.log(emailData)

        const emailObj = emailData.find(email => email.primary === true && email.verified === true)
        const findUserEmail = await client.user.count({
            where: {
                email: emailObj.email
            }
        })

        let user;
        if (!findUserEmail && !user) {
            const hashPassword = await bcrypt.hash(String(Date.now()), 10)

            user = await client.user.create({
                data: {
                    name: userData.name,
                    socialLogin: "GITHUB",
                    username: userData.login,
                    email: emailObj.email,
                    location: userData.location,
                    avatar: userData.avatar_url,
                    password: hashPassword
                }
            })
        }
        user = await client.user.findUnique({
            where: {
                email: emailObj.email
            }
        })

        const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY)
        return res.json({ token: jwtToken })
    }
}


export const naverLogin = async (req, res) => {
    const { token } = req.body

    const apiUrl = `https://openapi.naver.com/v1/nid/me`
    const userData = await (
        await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    ).json()

    const { response } = userData
    const findUserEmail = await client.user.count({
        where: {
            email: response.email
        }
    })

    let user;
    if (!findUserEmail && !user) {
        const hashPassword = await bcrypt.hash(String(Date.now()), 10)
        await client.user.create({
            data: {
                name: response.name,
                socialLogin: "NAVER",
                username: response.id,
                email: response.email,
                avatar: response.profile_image,
                password: hashPassword
            }
        })
    }
    user = await client.user.findUnique({
        where: {
            email: response.email
        }
    })

    const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY)
    return res.status(200).json({ jwtToken: jwtToken })
}