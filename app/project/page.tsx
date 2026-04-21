export default function ProjectPage() {
  return (
    <section className="grid">
      <article className="card">
        <h1 style={{ marginTop: 0 }}>내 프로젝트</h1>
        <p className="muted">저장한 비교 조건, 문의 내역, 체크리스트를 한 곳에서 관리합니다.</p>
      </article>

      <article className="grid grid-2">
        <div className="card">
          <strong>저장된 조건</strong>
          <p className="muted">- 웨딩: 강남 / 200명 / 예산 3,500만원</p>
          <p className="muted">- 인테리어: 수도권 / 32평 / 예산 2.5억원</p>
        </div>
        <div className="card">
          <strong>문의 진행 현황</strong>
          <p className="muted">- 접수 3건 / 응답완료 2건</p>
          <p className="muted">- 평균 응답 시간: 14시간</p>
        </div>
      </article>

      <article className="card">
        <strong>진행 체크리스트</strong>
        <ul>
          <li className="muted">견적서 항목 누락 여부 점검</li>
          <li className="muted">추가 비용 조건(별도/추후협의) 확인</li>
          <li className="muted">계약 전 최종 총액 검증</li>
        </ul>
      </article>
    </section>
  );
}
