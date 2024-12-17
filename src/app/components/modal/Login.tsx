"use client";

import style from "./Modal.module.scss";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_HOST}/api/oauth/kakao`;

const Login = () => {

    const onClickKakaoLogin = () => {
        window.location.href= `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    }

    return (
        <div className={style.login_wrap}>
            <button type="button" onClick={onClickKakaoLogin}>카카오로 로그인 하기</button>
        </div>
    )
}

export default Login;