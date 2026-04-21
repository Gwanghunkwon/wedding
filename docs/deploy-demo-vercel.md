# Vercel 빠른 데모 배포 가이드

이 문서는 현재 프로젝트를 외부 공개 가능한 데모 URL로 빠르게 배포하는 절차다.

## 전제

- 프로젝트 루트: `d:\wedding`
- Next.js 빌드가 로컬에서 통과해야 함
- GitHub 저장소가 있으면 가장 빠르게 반복 배포 가능

## 방법 A (권장): GitHub 연동 배포

1. 코드를 GitHub 저장소에 업로드
2. [https://vercel.com/new](https://vercel.com/new) 접속
3. GitHub repo Import
4. Framework Preset: Next.js (자동 인식)
5. Build Command: `next build` (기본값 유지)
6. Output: 기본값 유지
7. Deploy 클릭
8. 발급 URL 공유 (`https://<project>.vercel.app`)

## 방법 B: CLI 즉시 배포

```bash
npm install
npm run build
npx vercel
```

- 최초 1회는 로그인/프로젝트 생성 질문이 나온다.
- 즉시 운영 URL 배포:

```bash
npx vercel --prod
```

## 배포 후 확인 URL

- `/`
- `/wedding`
- `/interior`
- `/b2b`
- `/admin`
- `/project`

## 주의사항 (현재 데모 한계)

- `lead`/`event` 저장은 인메모리라 재배포/재시작 시 초기화됨
- `admin-summary` 일부 데이터는 샘플 하드코딩
- 데모 목적 공유에는 문제 없고, 운영 전에는 DB 연동 필요
