import Link from "next/link";

export default function ProjectPage() {
  return (
    <section className="gpt-frame">
      <aside className="gpt-sidebar">
        <div className="gpt-logo">Cost Compass</div>
        <button className="gpt-new-chat" type="button">
          + 새 프로젝트 노트
        </button>
        <div className="gpt-history">
          <div className="gpt-history-item">웨딩 프로젝트 A</div>
          <div className="gpt-history-item">인테리어 프로젝트 B</div>
        </div>
        <div className="gpt-history">
          <Link href="/">홈으로</Link>
          <Link href="/wedding">웨딩 비교</Link>
        </div>
      </aside>
      <main className="gpt-main">
        <div className="gpt-top">내 프로젝트</div>
        <div className="gpt-thread">
          <div className="gpt-msg">
            <strong>프로젝트 상태</strong>
            <div className="grid grid-2" style={{ marginTop: 10 }}>
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
            </div>
          </div>

          <div className="gpt-msg">
            <strong>진행 체크리스트</strong>
            <ul>
              <li className="muted">견적서 항목 누락 여부 점검</li>
              <li className="muted">추가 비용 조건(별도/추후협의) 확인</li>
              <li className="muted">계약 전 최종 총액 검증</li>
            </ul>
          </div>
        </div>
      </main>
    </section>
  );
}
