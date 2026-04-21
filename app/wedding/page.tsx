"use client";

import { FormEvent, useEffect, useState } from "react";
import { compareCosts, compareWeddingCosts, estimateGap } from "@/lib/pricing";
import { formatKrw } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-client";
import { extractTextFromImage, isImageFile } from "@/lib/ocr";

export default function WeddingPage() {
  const [region, setRegion] = useState("강남");
  const [guests, setGuests] = useState(200);
  const [budget, setBudget] = useState(35000000);
  const [estimateText, setEstimateText] = useState("");
  const [validationResult, setValidationResult] = useState<string[]>([]);
  const [validationMeta, setValidationMeta] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");

  const result = compareWeddingCosts({ region, guests }) as Extract<ReturnType<typeof compareCosts>, { category: "wedding" }>;
  const gap = estimateGap(budget, result.averageTotal);

  useEffect(() => {
    void trackEvent({ name: "compare_result_viewed", category: "wedding" });
  }, [region, guests]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const validateEstimate = async () => {
    setValidationResult([]);
    setValidationMeta("");
    const response = await fetch("/api/validate-estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "wedding", text: estimateText })
    });
    const json = await response.json();
    if (!json.ok) {
      setValidationResult(["견적 검증에 실패했습니다. 입력 내용을 확인하세요."]);
      return;
    }
    setValidationResult(json.data.warnings.length ? json.data.warnings : ["핵심 누락/주의 항목이 감지되지 않았습니다."]);
    if (json.data.parsedTotal) {
      setValidationMeta(`파싱된 금액 합계: ${json.data.parsedTotal.toLocaleString("ko-KR")}원`);
    }
  };

  const importEstimateFile = async (file: File | null) => {
    if (!file) return;
    if (isImageFile(file)) {
      setOcrStatus("OCR 추출 중...");
      const text = await extractTextFromImage(file);
      setEstimateText(text.slice(0, 5000));
      setOcrStatus("이미지에서 텍스트를 추출했습니다.");
      return;
    }

    const text = await file.text();
    setEstimateText(text.slice(0, 5000));
    setOcrStatus(".txt 파일을 불러왔습니다.");
  };

  const sendLead = async () => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "wedding",
        customerName: "예비부부",
        budget,
        message: leadMessage || `${region} ${guests}명 기준 상담 요청`
      })
    });
    const json = await response.json();
    setLeadStatus(json.ok ? "문의가 접수되었습니다." : "문의 접수에 실패했습니다.");
  };

  return (
    <section className="grid">
      <article className="card">
        <h1 style={{ marginTop: 0 }}>웨딩 비용 비교</h1>
        <p className="muted">지역/하객수를 기준으로 평균 총액, 항목 비중, 실제 사례를 비교합니다.</p>
        <form className="grid grid-3" onSubmit={onSubmit}>
          <label>
            <div className="muted">지역</div>
            <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option>강남</option>
              <option>강북</option>
              <option>지방</option>
            </select>
          </label>
          <label>
            <div className="muted">하객 수</div>
            <input className="input" type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </label>
          <label>
            <div className="muted">예산</div>
            <input className="input" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
          </label>
        </form>
      </article>

      <article className="grid grid-3">
        <div className="card">
          <div className="muted">예상 평균 총비용</div>
          <strong>{formatKrw(result.averageTotal)}</strong>
        </div>
        <div className="card">
          <div className="muted">비용 범위</div>
          <strong>
            {formatKrw(result.totalRange.min)} ~ {formatKrw(result.totalRange.max)}
          </strong>
        </div>
        <div className="card">
          <div className="muted">예산 대비</div>
          <strong>{gap >= 0 ? `${formatKrw(gap)} 여유` : `${formatKrw(Math.abs(gap))} 부족`}</strong>
        </div>
      </article>

      <article className="card">
        <h2 style={{ marginTop: 0 }}>항목별 평균 비용</h2>
        <div className="grid grid-2">
          <div className="card">식대: {formatKrw(result.averageByItem.mealCost)}</div>
          <div className="card">대관료: {formatKrw(result.averageByItem.hallCost)}</div>
          <div className="card">스드메: {formatKrw(result.averageByItem.sdmCost)}</div>
          <div className="card">옵션: {formatKrw(result.averageByItem.optionCost)}</div>
        </div>
      </article>

      <article className="card">
        <h2 style={{ marginTop: 0 }}>실제 사례 ({result.count}건)</h2>
        <div className="grid">
          {result.cases.map((item) => (
            <div key={item.id} className="card">
              <strong>
                {item.region} / {item.venueType} / 하객 {item.guests}명
              </strong>
              <p className="muted" style={{ marginBottom: 4 }}>
                총액 {formatKrw(item.totalCost)} | 출처: {item.source}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="grid grid-2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>근거 데이터</h2>
          <p className="muted">출처: 참가격/제휴업체/사용자 실지불 사례</p>
          <p className="muted">표본수: {result.count}건</p>
          <p className="muted">갱신일: 2026-04-21</p>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>다음 질문</h2>
          <p className="muted">식대 단가와 옵션(장식/연출)을 조정해 추가 시뮬레이션을 진행할까요?</p>
        </div>
      </article>

      <article className="grid grid-2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>견적 검증</h2>
          <p className="muted">받은 견적서를 붙여넣으면 누락/주의 항목을 확인합니다.</p>
          <textarea
            className="textarea"
            rows={6}
            value={estimateText}
            onChange={(e) => setEstimateText(e.target.value)}
            placeholder="예: 식대 2,200만원, 대관료 800만원, 드레스 별도..."
          />
          <div style={{ marginTop: 8 }}>
            <input
              className="input"
              type="file"
              accept=".txt,image/*"
              onChange={(e) => {
                void importEstimateFile(e.target.files?.[0] ?? null);
              }}
            />
          </div>
          {ocrStatus && <p className="muted">{ocrStatus}</p>}
          <div style={{ marginTop: 8 }}>
            <button className="button" type="button" onClick={validateEstimate}>
              검증 실행
            </button>
          </div>
          <ul>
            {validationResult.map((warning) => (
              <li key={warning} className="muted">
                {warning}
              </li>
            ))}
          </ul>
          {validationMeta && <p className="muted">{validationMeta}</p>}
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>업체 문의</h2>
          <p className="muted">비교 결과를 바탕으로 바로 상담을 요청합니다.</p>
          <textarea
            className="textarea"
            rows={4}
            value={leadMessage}
            onChange={(e) => setLeadMessage(e.target.value)}
            placeholder="희망 날짜, 옵션, 예산을 입력해 주세요."
          />
          <div style={{ marginTop: 8 }}>
            <button className="button" type="button" onClick={sendLead}>
              문의 보내기
            </button>
          </div>
          {leadStatus && <p className="muted">{leadStatus}</p>}
        </div>
      </article>
    </section>
  );
}
