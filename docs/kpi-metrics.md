# MVP KPI 정의서

## 목적

초기 3개월 동안 제품의 PMF 가능성과 수익화 가능성을 정량적으로 검증한다.

## 핵심 KPI

1. MAU: 10,000+
2. 비교 -> 문의 전환율: 8%~12%
3. 업체 응답률: 60%+
4. 실지불 사례 등록: 500건+

## KPI 측정 이벤트

- `compare_started`
- `compare_result_viewed`
- `lead_submitted`
- `lead_answered`
- `contract_case_uploaded`

## 이벤트 속성 표준

- 공통 필드: `name`, `category`, `source`, `createdAt`
- category: `wedding | interior | common`
- source: `web | api | b2b`
- 저장 정책: 최근 90일 원본 이벤트 보관, 이후 일 단위 집계만 유지

## KPI 목표 알림 기준

- 문의 전환율 < 8% (7일 이동평균): 경고
- 업체 응답률 < 60% (7일 이동평균): 경고
- 실지불 사례 주간 증가 < 30건: 콜드스타트 대응 캠페인 실행

## 대시보드 계산식

- 문의 전환율 = `lead_submitted / compare_result_viewed`
- 업체 응답률 = `lead_answered / lead_submitted`
- 사례 등록률 = `contract_case_uploaded / MAU`

## 실패 기준(리스크 신호)

- 4주 연속 문의 전환율 5% 미만
- 업체 응답률 40% 미만
- 데이터 최신성 14일 초과
