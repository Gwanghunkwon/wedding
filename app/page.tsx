"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics-client";

type HomeResult = {
  nextPath: "/wedding" | "/interior";
  summary: string;
};

export default function HomePage() {
  const [category, setCategory] = useState<"wedding" | "interior">("wedding");
  const [region, setRegion] = useState("");
  const [scale, setScale] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");
  const [result, setResult] = useState<HomeResult | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void trackEvent({ name: "compare_started", category, source: "web" });
    setResult({
      nextPath: category === "wedding" ? "/wedding" : "/interior",
      summary: `${category === "wedding" ? "예식" : "인테리어"} / ${region || "지역 미지정"} / ${scale || "규모 미지정"} / 스타일 ${style || "미지정"} / 예산 ${budget || "미지정"}`
    });
  };

  return (
    <section className="gpt-frame">
      <aside className="gpt-sidebar">
        <div className="gpt-logo">Cost Compass</div>
        <button className="gpt-new-chat" type="button">
          + 새 견적 대화
        </button>
        <div className="gpt-history">
          <div className="gpt-history-item">강남 웨딩 + 스드메 조합</div>
          <div className="gpt-history-item">수도권 30평대 인테리어</div>
          <div className="gpt-history-item">업체 문의 전 최종 검증</div>
        </div>
      </aside>

      <main className="gpt-main">
        <div className="gpt-top">모델: Cost Compass Assistant</div>
        <div className="gpt-thread">
          <div className="gpt-msg">
            <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 26 }}>무엇을 도와드릴까요?</h1>
            <p className="muted" style={{ margin: 0 }}>
              예식장/인테리어 조건을 입력하면 평균가, 근거, 다음 행동을 한 번에 정리해드립니다.
            </p>
          </div>
          {!result ? (
            <div className="gpt-msg user">
              지역, 예산, 규모를 입력해 비교를 시작해보세요.
            </div>
          ) : (
            <div className="gpt-msg">
              <strong>핵심 요약</strong>
              <p className="muted">{result.summary}</p>
              <p className="muted">근거: 표본 320건, 갱신 2일 전, 공공+실지불 결합 데이터</p>
              <Link href={result.nextPath} className="button" style={{ display: "inline-block" }}>
                결과 페이지 이동
              </Link>
            </div>
          )}
        </div>
        <div className="gpt-composer-wrap">
          <form onSubmit={onSubmit} className="gpt-composer">
            <div className="gpt-composer-row">
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value as "wedding" | "interior")}>
                <option value="wedding">예식</option>
                <option value="interior">인테리어</option>
              </select>
              <input className="input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="지역 (예: 강남, 수도권)" />
            </div>
            <div className="gpt-composer-row">
              <input className="input" value={scale} onChange={(e) => setScale(e.target.value)} placeholder={category === "wedding" ? "하객 수 (예: 200)" : "평형 (예: 32)"} />
              <input className="input" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="스타일 (예: 모던, 클래식)" />
            </div>
            <div className="gpt-composer-row">
              <input className="input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="예산 (숫자만 입력)" />
              <button className="button" type="submit">
                비교 시작
              </button>
            </div>
          </form>
          <div className="gpt-note">메시지처럼 조건을 입력하면 다음 단계(비교/검증/문의)까지 이어집니다.</div>
        </div>
      </main>
    </section>
  );
}
