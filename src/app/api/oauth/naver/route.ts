import { executeQuery } from "@/app/_lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const NAVER_REST_API_KEY = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET_KEY = process.env.NAVER_CLIENT_SECRET_KEY;
const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY as string;
const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY as string;
const NAVER_REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_HOST}/api/oauth/naver`;

export const GET = async (req:NextRequest, res:NextResponse) => {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    let accessToken:string;
    let refreshToken:string; 

    let response = await( await fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_REST_API_KEY}&client_secret=${NAVER_CLIENT_SECRET_KEY}&code=${code}&state=false`, {
        method: "GET",
        headers: {
            'X-Naver-Client-Id': NAVER_REST_API_KEY as string,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET_KEY as string
        }
    })).json();

    accessToken = response.access_token;
    refreshToken = response.refresh_token;

    console.log(response);

    response = await( await fetch('https://openapi.naver.com/v1/nid/me', {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })).json();

    console.log(response.response.id);

    const userIdArray:number[] = await executeQuery(`SELECT id FROM user WHERE naverId = "${response.response.id}"`,[]) as any;

    if(userIdArray.length === 0) {
        await executeQuery(`INSERT INTO User(Name, profileImg, naverId) VALUES("${response.response.nickname}", "${response.response.profile_image}", "${response.response.id}");`,[])
    }
    
    return NextResponse.json({accessToken: jwt.sign({ userId: userIdArray[0] }, JWT_ACCESS_TOKEN_KEY, {expiresIn: '30m'}),
    refreshToken: jwt.sign({ userId: userIdArray[0] }, JWT_REFRESH_TOKEN_KEY, {expiresIn: '30m'}),
    name: response.response.nickname,
    profileImage: response.response.profile_image},
    { status: 200 });
}