"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminSummaryResponse = {
  ok: boolean;
  data: {
    kpi: {
      totals: Record<string, number>;
      metrics: {
        inquiryConversionRate: number;
        providerResponseRate: number;
      };
    };
    sourceHealth: Array<{ source: string; status: string; lastSyncedAt: string }>;
    outlierQueue: Array<{ id: string; category: string; reason: string; status: string }>;
  };
};

export default function AdminPage() {
  const [summary, setSummary] = useState<AdminSummaryResponse["data"] | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const response = await fetch("/api/admin-summary");
      const json: AdminSummaryResponse = await response.json();
      if (json.ok) setSummary(json.data);
    };
    void fetchSummary();
  }, []);

  if (!summary) {
    return <section className="card">관리자 대시보드를 불러오는 중입니다.</section>;
  }

  return (
    <section className="gpt-frame">
      <aside className="gpt-sidebar">
        <div className="gpt-logo">Cost Compass</div>
        <button className="gpt-new-chat" type="button">
          + 새 운영 점검
        </button>
        <div className="gpt-history">
          <div className="gpt-history-item">일일 KPI 점검</div>
          <div className="gpt-history-item">소스 동기화 실패 알림</div>
          <div className="gpt-history-item">이상치 검수 대기 2건</div>
        </div>
        <div className="gpt-history">
          <Link href="/">홈으로</Link>
          <Link href="/b2b">업체 콘솔</Link>
        </div>
      </aside>

      <main className="gpt-main">
        <div className="gpt-top">운영 콘솔</div>
        <div className="gpt-thread">
          <div className="gpt-msg">
            <strong>KPI 요약</strong>
            <div className="grid grid-3" style={{ marginTop: 10 }}>
              <div className="card">
                <div className="muted">문의 전환율</div>
                <strong>{summary.kpi.metrics.inquiryConversionRate}%</strong>
              </div>
              <div className="card">
                <div className="muted">업체 응답률</div>
                <strong>{summary.kpi.metrics.providerResponseRate}%</strong>
              </div>
              <div className="card">
                <div className="muted">실지불 사례 등록</div>
                <strong>{summary.kpi.totals.contract_case_uploaded}건</strong>
              </div>
            </div>
          </div>

          <div className="gpt-msg">
            <strong>데이터 소스 상태</strong>
            <div className="grid" style={{ marginTop: 10 }}>
              {summary.sourceHealth.map((item) => (
                <div className="card" key={item.source}>
                  <strong>{item.source}</strong>
                  <p className="muted">상태: {item.status}</p>
                  <p className="muted">마지막 동기화: {new Date(item.lastSyncedAt).toLocaleString("ko-KR")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="gpt-msg">
            <strong>이상치 검수 큐</strong>
            <div className="grid" style={{ marginTop: 10 }}>
              {summary.outlierQueue.map((item) => (
                <div className="card" key={item.id}>
                  <strong>
                    {item.id} / {item.category}
                  </strong>
                  <p className="muted">{item.reason}</p>
                  <p className="muted">상태: {item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
