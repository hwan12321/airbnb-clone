import { executeQuery } from "@/app/_lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY as string;
const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY as string;
const KAKAO_REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_HOST}/api/oauth/kakao`;

export const GET = async (req:NextRequest, res:NextResponse) => {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    let accessToken:string;
    let refreshToken:string; 

    let response = await( await fetch('https://kauth.kakao.com/oauth/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}`,
    })).json();

    accessToken = response.access_token;
    refreshToken = response.refresh_token;

    response = await( await fetch('https://kapi.kakao.com/v2/user/me', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })).json();

    const userIdArray:number[] = await executeQuery(`SELECT * FROM user WHERE KakaoId = ${response.id}`,[]) as any;

    if(userIdArray.length === 0) {
        await executeQuery(`INSERT INTO User(Name, profileImg, kakaoId) VALUES("${response.kakao_account.profile.nickname}", "${response.kakao_account.profile.profile_image_url}", ${response.id});`,[])
    }
    
    return NextResponse.json({accessToken: jwt.sign({ userId: userIdArray[0] }, JWT_ACCESS_TOKEN_KEY, {expiresIn: '30m'}),
    refreshToken: jwt.sign({ userId: userIdArray[0] }, JWT_REFRESH_TOKEN_KEY, {expiresIn: '30m'}),
    name: response.kakao_account.profile.nickname,
    profileImage: response.kakao_account.profile.profile_image_url},
    { status: 200 });
}