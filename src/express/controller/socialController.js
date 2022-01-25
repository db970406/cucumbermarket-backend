/* 
작성자 : SJ
작성일 : 2022.01.05
수정일 : 2022.01.19
*/

import fetch from "node-fetch";
import client from '../../apollo/client';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 깃허브, 네이버 소셜로그인 구현
// 카카오는 사업자 미등록으로 비즈앱이 아니라 이메일을 못가져와서 구현은 못하였고 방법만 숙지함

export const githubLogin = async (req, res) => {
    const { code } = req.body;
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.SOCIAL_GITHUB_KEY,
        client_secret: process.env.SOCIAL_GITHUB_SECRET,
        code
    };
    const params = new URLSearchParams(config).toString();

    const reqUrl = `${baseUrl}?${params}`;
    const token = await (
        await fetch(reqUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();

    if ("access_token" in token) {
        const { access_token } = token;

        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();

        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();

        const emailObj = emailData.find(email => email.primary === true && email.verified === true);
        const findUserEmail = await client.user.count({
            where: {
                email: emailObj.email
            }
        });

        let user;
        if (!findUserEmail && !user) {
            const hashPassword = await bcrypt.hash(String(Date.now()), 10);

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
            });
        }
        user = await client.user.findUnique({
            where: {
                email: emailObj.email
            }
        });

        const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY);
        return res.json({ jwtToken });
    }
}


export const naverLogin = async (req, res) => {
    const { code } = req.body;
    const baseUrl = `https://nid.naver.com/oauth2.0/token`;
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.SOCIAL_NAVER_KEY,
        client_secret: process.env.SOCIAL_NAVER_SECRET,
        code,
        state: process.env.SOCIAL_NAVER_STATE
    };

    const params = new URLSearchParams(config).toString();
    const reqUrl = `${baseUrl}?${params}`;

    const token = await (
        await fetch(reqUrl, {
            method: "POST"
        })
    ).json();

    if ("access_token" in token) {
        const { access_token } = token;
        const apiUrl = "https://openapi.naver.com/v1/nid/me";

        const userData = await (
            await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
        ).json();

        const { response } = userData;
        const findUserEmail = await client.user.count({
            where: {
                email: response.email
            }
        });
        let user;
        if (!findUserEmail && !user) {
            const hashPassword = await bcrypt.hash(String(Date.now()), 10);
            await client.user.create({
                data: {
                    name: response.name,
                    socialLogin: "NAVER",
                    username: response.id,
                    email: response.email,
                    avatar: response.profile_image,
                    password: hashPassword
                }
            });
        }
        user = await client.user.findFirst({
            where: {
                email: response.email
            }
        });

        const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY);
        return res.status(200).json({ jwtToken });
    }
}

export const kakaoLogin = async (req, res) => {
    const { code } = req.body;
    const baseUrl = "https://kauth.kakao.com/oauth/token";

    const config = {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.SOCIAL_KAKAO_CODE_REDIRECT,
        code
    };

    const params = new URLSearchParams(config).toString();

    const reqUrl = `${baseUrl}?${params}`;

    const token = await (
        await fetch(reqUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
    ).json();

    if ("access_token" in token) {
        const { access_token } = token;
        const apiUrl = `https://kapi.kakao.com`;

        const userData = await (
            await fetch(`${apiUrl}/v2/user/me`, {
                method: "POST",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${access_token}`
                }
            })
        ).json();
        // 그런데 카카오는 사업자 등록해서 비즈앱으로 전환해야 이메일 필수 동의가 가능하다.
        // 카카오 소셜로그인 방식은 알았으니 여기까지만 하자
        return;

        /* const findUserEmail = await client.user.count({
            where: {
                email: userData.properties.email
            }
        })

        let user;
        if (!findUserEmail && !user) {
            const hashPassword = await bcrypt.hash(String(Date.now()), 10)
            await client.user.create({
                data: {
                    name: userData.properties.nickname,
                    socialLogin: "KAKAO",
                    username: userData.id,
                    email: userData.properties.email,
                    avatar: response.profile_image,
                    password: hashPassword
                }
            })
        }
        user = await client.user.findUnique({
            where: {
                email: userData.properties.email
            }
        })

        const jwtToken = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY)
        return res.status(200).json({ jwtToken: jwtToken }) */
    }

}