/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : ------
*/

import fetch from "node-fetch"
import client from '../../apollo/client'
import bcrypt from "bcrypt"

/*
https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
깃허브 소셜로그인
*/
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
        if (!findUserEmail) {
            const hashPassword = await bcrypt.hash(String(Date.now()), 10)
            await client.user.create({
                data: {
                    name: userData.name,
                    socialLogin: true,
                    username: userData.login,
                    email: emailObj.email,
                    location: userData.location,
                    avatar: userData.avatar_url,
                    password: hashPassword
                }
            })
        }

        return res.redirect("/")
    }
}