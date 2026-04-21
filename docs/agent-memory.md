# Agent Memory (지속 작업 기록)

이 문서는 다음 세션에서도 빠르게 맥락을 복구하기 위한 작업 기록이다.

## 현재 구현 상태 요약

- 프론트는 Next.js App Router 기반
- 핵심 사용자 플로우는 동작함
  - 홈 입력
  - 웨딩/인테리어 비교
  - 견적 검증
  - 업체 문의
- B2B 콘솔과 운영(Admin) 콘솔 화면 존재
- 데이터 파이프라인 v1(샘플) 존재

## 이미 구현된 페이지

- `app/page.tsx`: 대화형 홈
- `app/wedding/page.tsx`: 웨딩 비교/검증/문의
- `app/interior/page.tsx`: 인테리어 비교/검증/문의
- `app/b2b/page.tsx`: 리드 수신함/응답/간단 과금 정보
- `app/admin/page.tsx`: KPI 요약, 소스 상태, 이상치 큐
- `app/project/page.tsx`: 내 프로젝트 요약

## 이미 구현된 API

- `app/api/compare/route.ts`
  - 조건 기반 비교 결과 반환
- `app/api/validate-estimate/route.ts`
  - 키워드 누락/주의 문구 탐지
  - 금액 파싱 합계와 평균 비교 경고
- `app/api/leads/route.ts`
  - 문의 등록/조회
  - 문의 등록 시 이벤트 저장
- `app/api/events/route.ts`
  - 이벤트 등록/조회
- `app/api/admin-summary/route.ts`
  - KPI 요약 + 소스 상태 + 이상치 큐 반환

## 도메인 로직

- `lib/pricing.ts`
  - 웨딩/인테리어 평균가, 범위, 항목별 평균 계산
- `lib/event-store.ts`
  - 이벤트 인메모리 저장 및 KPI 집계
- `lib/analytics-client.ts`
  - 프론트 이벤트 전송
- `lib/ocr.ts`
  - 이미지 파일 OCR 텍스트 추출(`tesseract.js`)

## 파이프라인 상태

- `pipeline/public_data_ingest.py`: 공공 데이터 샘플 수집
- `pipeline/normalize.py`: 정규화/중복제거/이상치 제거
- `pipeline/source_policy.py`: 소스 정책 위반 검사
- `pipeline/quality_report.py`: 품질 리포트 생성
- `pipeline/run_pipeline.py`: 실행 엔트리

## 현재 기술 부채/주의점

- `leadStore`, `eventStore`는 인메모리라 서버 재시작 시 초기화됨
- `admin-summary`의 소스 상태/이상치 큐는 현재 하드코딩 샘플
- OCR은 클라이언트 처리라 파일 크기/브라우저 성능 영향 가능
- 인증/권한 체계 없음(B2C/B2B/Admin 분리 미구현)

## 다음 우선순위(권장)

1. 인메모리 저장소를 PostgreSQL로 전환
2. 문의/이벤트/관리자 데이터 실DB 기반 연결
3. 인증(업체 계정)과 권한 분리
4. OCR 후 항목 파싱 정확도 개선(정규식+룰셋 고도화)
