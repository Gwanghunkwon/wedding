# Wedding + Interior Cost Compass

예식장/인테리어 비용 비교와 견적 검증을 위한 SaaS MVP입니다.

## MVP 목표

- 가격 정보 비대칭 해소(평균가/중앙값/범위 기반 비교)
- 사용자 견적 검증 지원(누락/과다 항목 탐지)
- 업체 리드 전환(B2B 문의 수신/응답 관리)

## 확정 KPI (출시 후 3개월)

- MAU: 10,000+
- 비교 결과에서 문의 전환율: 8%~12%
- 업체 문의 응답률: 60%+
- 사용자 실지불 사례 등록: 500건+

## 핵심 기능

- 대화형 조건 입력(지역, 예산, 인원/평형, 스타일)
- 웨딩/인테리어 비용 비교 카드
- 견적서 텍스트 검증 API
- 업체 리드 수신함(B2B 콘솔)
- 데이터 수집/정제 파이프라인 v1(샘플)

## 빠른 시작

```bash
npm install
npm run dev
```

웹: `http://localhost:3000`

## 폴더 구조

- `app/`: Next.js App Router 화면 및 API
- `lib/`: 도메인 로직(비용 계산, 검증)
- `data/`: 샘플 데이터(웨딩/인테리어 사례)
- `docs/`: KPI/법적준수/운영 문서
- `pipeline/`: 공공데이터 수집/정제 파이프라인 v1

## 지속 작업용 문서

- `docs/agent-memory.md`: 누락 방지용 핵심 구현 상태 기록
- `docs/system-map.md`: 전체 아키텍처/데이터 흐름
- `docs/session-progress-log.md`: 세션별 진행 로그
- `docs/project-state.json`: 기계가 읽기 쉬운 현재 상태 스냅샷

## 세션 로그 자동 기록

```bash
npm run session:log -- --summary "OCR 및 검증룰 고도화" --done "이미지 OCR 적용|과다 경고 추가" --checks "npm run lint 통과|npm run build 통과" --next "DB 영속화|Auth 적용" --status "mvp-stable"
```

- `--done`, `--checks`, `--next`는 `|`로 여러 항목 입력
- 실행 시 아래 파일이 자동 갱신됨
  - `docs/session-progress-log.md`
  - `docs/project-state.json`

## 외부 데모 배포

- 빠른 Vercel 공개 가이드: `docs/deploy-demo-vercel.md`

## 소셜 로그인 설정

- Google/Kakao/Naver 설정 가이드: `docs/social-login-setup.md`
