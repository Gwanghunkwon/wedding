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
    <section className="grid grid-2">
      <article className="card">
        <h1 style={{ marginTop: 0 }}>어떤 준비를 하고 있나요?</h1>
        <p className="muted">GPT/제미나이 스타일로 조건을 입력하면 요약과 다음 액션을 제시합니다.</p>
        <form onSubmit={onSubmit} className="grid">
          <label>
            <div className="muted">카테고리</div>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value as "wedding" | "interior")}>
              <option value="wedding">예식</option>
              <option value="interior">인테리어</option>
            </select>
          </label>
          <label>
            <div className="muted">지역</div>
            <input className="input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="예: 강남, 수도권" />
          </label>
          <label>
            <div className="muted">{category === "wedding" ? "하객 수" : "평형"}</div>
            <input className="input" value={scale} onChange={(e) => setScale(e.target.value)} placeholder={category === "wedding" ? "예: 200명" : "예: 32평"} />
          </label>
          <label>
            <div className="muted">스타일</div>
            <input className="input" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="예: 모던, 클래식, 스몰웨딩" />
          </label>
          <label>
            <div className="muted">예산</div>
            <input className="input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="예: 35000000" />
          </label>
          <button className="button" type="submit">
            비교 시작
          </button>
        </form>
      </article>

      <article className="card">
        <h2 style={{ marginTop: 0 }}>실시간 요약 카드</h2>
        {!result ? (
          <p className="muted">좌측 조건을 입력하면 핵심 요약과 추천 경로를 보여줍니다.</p>
        ) : (
          <div className="grid">
            <div className="card">
              <strong>핵심 요약</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                {result.summary}
              </p>
            </div>
            <div className="card">
              <strong>근거 데이터</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                표본수 320건, 최근 갱신 2일 전(공공데이터+실지불 사례 기준)
              </p>
            </div>
            <div className="card">
              <strong>다음 질문</strong>
              <p className="muted" style={{ marginBottom: 8 }}>
                옵션 구성(드레스/장식 또는 공사 범위)을 선택하면 예측 정확도가 올라갑니다.
              </p>
              <Link href={result.nextPath} className="button" style={{ display: "inline-block" }}>
                결과 페이지 이동
              </Link>
            </div>
            <p className="muted">출처 투명성: 결과 페이지에서 표본 수와 출처를 확인할 수 있습니다.</p>
          </div>
        )}
      </article>
    </section>
  );
}
