# 데이터 파이프라인 v1

공공데이터 중심 샘플 수집/정제/검증 파이프라인입니다.

## 구성

- `public_data_ingest.py`: 공개 데이터 소스 수집 샘플
- `schema.py`: Raw/정규화 스키마
- `normalize.py`: 표준화, 중복제거, 이상치 제거
- `source_policy.py`: 수집 소스 정책 위반 검증
- `run_pipeline.py`: 파이프라인 실행 엔트리
- `quality_report.py`: 정제 품질 리포트 생성

## 실행

```bash
python run_pipeline.py
python quality_report.py
```

## v1 검증 규칙

- 중복 키: `category+region+subtype+scale_value+total_cost`
- 이상치: 중앙값의 2배 초과 데이터 제외
- 신뢰도: 출처 유형/구조화 수준 기반 기본 점수
- 정책 위반: 차단 URL 키워드/허용되지 않은 source_type 검사

## 출력 지표

- `raw_count`: 수집 원천 데이터 수
- `deduped_count`: 중복 제거 후 레코드 수
- `cleaned_count`: 이상치 제거 후 서비스 반영 대상 수
- `source_distribution`: 소스별 데이터 분포
