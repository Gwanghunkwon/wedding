# 소셜 로그인 설정 (Google / Kakao / Naver)

## 1) 환경변수 준비

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 채운다.

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=랜덤_긴_문자열

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...

NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

참고 템플릿: `.env.example`

## 2) Provider별 Redirect URI 등록

NextAuth 콜백 주소는 다음 형식을 사용한다.

- Google: `http://localhost:3000/api/auth/callback/google`
- Kakao: `http://localhost:3000/api/auth/callback/kakao`
- Naver: `http://localhost:3000/api/auth/callback/naver`

배포 후에는 도메인 기준으로 동일하게 등록해야 한다.

- 예: `https://your-domain.com/api/auth/callback/google`

## 3) 로그인 확인 경로

- 로그인 페이지: `/login`
- 인증 API 라우트: `/api/auth/*`

## 4) 현재 구현 범위

- 로그인 제공자: Google / Kakao / Naver
- 로그인 페이지 커스텀: `app/login/page.tsx`
- NextAuth 설정: `lib/auth-options.ts`
- 라우트 핸들러: `app/api/auth/[...nextauth]/route.ts`
