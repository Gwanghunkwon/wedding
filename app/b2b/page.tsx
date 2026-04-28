"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics-client";

type Lead = {
  id: string;
  customer: string;
  category: "wedding" | "interior";
  budget: number;
  message: string;
  status: "신규" | "응답완료";
};

const initialLeads: Lead[] = [
  {
    id: "l-001",
    customer: "김예비",
    category: "wedding",
    budget: 35000000,
    message: "강남 호텔웨딩 200명 기준 견적 요청",
    status: "신규"
  },
  {
    id: "l-002",
    customer: "박고객",
    category: "interior",
    budget: 240000000,
    message: "32평 전체 리모델링, 모던 스타일 희망",
    status: "응답완료"
  }
];

export default function B2BPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [template, setTemplate] = useState("안녕하세요. 요청하신 조건 기준으로 상세 견적서를 전달드리겠습니다.");

  const metrics = useMemo(() => {
    const total = leads.length;
    const answered = leads.filter((lead) => lead.status === "응답완료").length;
    return {
      total,
      answered,
      responseRate: total ? Math.round((answered / total) * 100) : 0
    };
  }, [leads]);

  const markAnswered = (id: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: "응답완료" } : lead)));
    void trackEvent({ name: "lead_answered", category: "common", source: "b2b" });
  };

  const getLeadQuality = (lead: Lead) => {
    let score = 50;
    if (lead.message.length > 20) score += 20;
    if (lead.budget > 30000000) score += 15;
    if (lead.status === "응답완료") score += 15;
    return Math.min(100, score);
  };

  return (
    <section className="gpt-frame">
      <aside className="gpt-sidebar">
        <div className="gpt-logo">Cost Compass</div>
        <button className="gpt-new-chat" type="button">
          + 새 응답 작성
        </button>
        <div className="gpt-history">
          <div className="gpt-history-item">신규 웨딩 리드 1건</div>
          <div className="gpt-history-item">인테리어 문의 응답 완료</div>
        </div>
        <div className="gpt-history">
          <Link href="/">홈으로</Link>
          <Link href="/admin">운영 콘솔</Link>
        </div>
      </aside>

      <main className="gpt-main">
        <div className="gpt-top">업체 콘솔</div>
        <div className="gpt-thread">
          <div className="gpt-msg">
            <strong>성과 요약</strong>
            <div className="grid grid-3" style={{ marginTop: 10 }}>
              <div className="card">
                <div className="muted">월간 리드</div>
                <strong>{metrics.total}건</strong>
              </div>
              <div className="card">
                <div className="muted">응답 완료</div>
                <strong>{metrics.answered}건</strong>
              </div>
              <div className="card">
                <div className="muted">응답률</div>
                <strong>{metrics.responseRate}%</strong>
              </div>
            </div>
          </div>

          <div className="gpt-msg">
            <strong>리드 수신함</strong>
            <div className="grid" style={{ marginTop: 10 }}>
              {leads.map((lead) => (
                <div key={lead.id} className="card">
                  <strong>
                    {lead.customer} / {lead.category}
                  </strong>
                  <p className="muted">{lead.message}</p>
                  <p className="muted">희망 예산: {lead.budget.toLocaleString("ko-KR")}원</p>
                  <p className="muted">상태: {lead.status}</p>
                  <p className="muted">리드 품질 점수: {getLeadQuality(lead)}점</p>
                  {lead.status === "신규" && (
                    <button className="button" onClick={() => markAnswered(lead.id)}>
                      템플릿으로 응답 처리
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="gpt-msg">
            <strong>수익화 모델</strong>
            <p className="muted">CPL: 유효 리드 1건당 18,000원</p>
            <p className="muted">월 구독 Basic: 19만원 / Pro: 49만원</p>
          </div>
        </div>

        <div className="gpt-composer-wrap">
          <div className="gpt-composer">
            <label>
              <div className="muted">응답 템플릿</div>
              <textarea className="textarea" rows={3} value={template} onChange={(e) => setTemplate(e.target.value)} />
            </label>
            <button className="button" type="button">
              Pro 플랜 업그레이드 문의
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}
