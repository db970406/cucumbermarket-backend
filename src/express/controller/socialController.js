/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import fetch from "node-fetch"
import client from '../../apollo/client'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// 깃허브, 네이버 소셜로그인 구현

//https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
export const githubStart = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`
    const config = {
        client_id: process.env.SOCIAL_GITHUB_KEY,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString()

    const reqUrl = `${baseUrl}?${params}`

    return res.redirect(reqUrl)
}
export const githubFinish = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.SOCIAL_GITHUB_KEY,
        client_secret: process.env.SOCIAL_GITHUB_SECRET,
        code: req.query.code
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

        const emailObj = emailData.find(email => email.primary === true && email.verified === true)
        const findUserEmail = await client.user.count({
            where: {
                email: emailObj.email
            }
        })

        let user;
        if (!findUserEmail) {
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
        } else {
            user = await client.user.findUnique({
                where: {
                    email: emailObj.email
                }
            })
        }

        const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY)
        return res.json({ token: jwtToken })
    }
}


//https://developers.naver.com/docs/login/devguide/devguide.md#3-4-1-%EB%84%A4%EC%9D%B4%EB%B2%84-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%97%B0%EB%8F%99%EC%9D%84-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0%EC%97%90-%EC%95%9E%EC%84%9C
export const naverStart = (req, res) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/authorize"
    const config = {
        response_type: "code",
        client_id: process.env.SOCIAL_NAVER_KEY,
        state: process.env.SOCIAL_NAVER_STATE,
        redirect_uri: process.env.SOCIAL_NAVER_REDIRECT
    }
    const params = new URLSearchParams(config).toString()

    const reqUrl = `${baseUrl}?${params}`
    return res.redirect(reqUrl)
}
export const naverFinish = async (req, res) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/token"
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.SOCIAL_NAVER_KEY,
        client_secret: process.env.SOCIAL_NAVER_SECRET,
        code: req.query.code,
        state: process.env.SOCIAL_NAVER_STATE
    }
    const params = new URLSearchParams(config).toString()

    const reqUrl = `${baseUrl}?${params}`

    const token = await (
        await fetch(reqUrl, {
            method: "POST"
        })
    ).json()

    if ("access_token" in token) {
        const { access_token } = token
        const apiUrl = `https://openapi.naver.com/v1/nid/me`
        const userData = await (
            await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
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
        if (!findUserEmail) {
            const hashPassword = await bcrypt.hash(String(Date.now()), 10)
            user = await client.user.create({
                data: {
                    name: response.name,
                    socialLogin: "NAVER",
                    username: response.id,
                    email: response.email,
                    avatar: response.profile_image,
                    password: hashPassword
                }
            })
        } else {
            user = await client.user.findUnique({
                where: {
                    email: response.email
                }
            })
        }
        const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY)
        return res.json({ token: jwtToken })
    }
}