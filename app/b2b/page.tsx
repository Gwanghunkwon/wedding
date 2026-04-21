"use client";

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
    <section className="grid">
      <article className="grid grid-3">
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
      </article>

      <article className="card">
        <h1 style={{ marginTop: 0 }}>업체 리드 수신함</h1>
        <p className="muted">문의를 확인하고 템플릿 답변으로 빠르게 응답하세요.</p>
        <label>
          <div className="muted">응답 템플릿</div>
          <textarea className="textarea" rows={3} value={template} onChange={(e) => setTemplate(e.target.value)} />
        </label>
      </article>

      <article className="card">
        <div className="grid">
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
      </article>

      <article className="grid grid-2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>과금 모델 (2단계)</h2>
          <p className="muted">CPL: 유효 리드 1건당 18,000원</p>
          <p className="muted">월 구독 Basic: 19만원 / Pro: 49만원</p>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Pro 플랜 혜택</h2>
          <p className="muted">우선 노출, 리드 품질 점수, 월간 성과 리포트</p>
          <button className="button" type="button">
            플랜 업그레이드 문의
          </button>
        </div>
      </article>
    </section>
  );
}
