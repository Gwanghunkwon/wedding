"use client";

import { FormEvent, useEffect, useState } from "react";
import { compareCosts, compareInteriorCosts, estimateGap } from "@/lib/pricing";
import { formatKrw } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-client";
import { extractTextFromImage, isImageFile } from "@/lib/ocr";

export default function InteriorPage() {
  const [region, setRegion] = useState("수도권");
  const [areaPy, setAreaPy] = useState(32);
  const [budget, setBudget] = useState(250000000);
  const [estimateText, setEstimateText] = useState("");
  const [validationResult, setValidationResult] = useState<string[]>([]);
  const [validationMeta, setValidationMeta] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");

  const result = compareInteriorCosts({ region, areaPy }) as Extract<ReturnType<typeof compareCosts>, { category: "interior" }>;
  const gap = estimateGap(budget, result.averageTotal);

  useEffect(() => {
    void trackEvent({ name: "compare_result_viewed", category: "interior" });
  }, [region, areaPy]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const validateEstimate = async () => {
    setValidationResult([]);
    setValidationMeta("");
    const response = await fetch("/api/validate-estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "interior", text: estimateText })
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
        category: "interior",
        customerName: "리모델링 고객",
        budget,
        message: leadMessage || `${region} ${areaPy}평 기준 상담 요청`
      })
    });
    const json = await response.json();
    setLeadStatus(json.ok ? "문의가 접수되었습니다." : "문의 접수에 실패했습니다.");
  };

  return (
    <section className="grid">
      <article className="card">
        <h1 style={{ marginTop: 0 }}>인테리어 비용 비교</h1>
        <p className="muted">지역/평형 기준으로 표준 견적과 실제 사례를 비교합니다.</p>
        <form className="grid grid-3" onSubmit={onSubmit}>
          <label>
            <div className="muted">지역</div>
            <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option>수도권</option>
              <option>광역시</option>
              <option>지방</option>
            </select>
          </label>
          <label>
            <div className="muted">평형</div>
            <input className="input" type="number" value={areaPy} onChange={(e) => setAreaPy(Number(e.target.value))} />
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
          <div className="card">평당 공사비: {formatKrw(result.averageByItem.unitCostPy)}</div>
          <div className="card">옵션: {formatKrw(result.averageByItem.optionCost)}</div>
        </div>
      </article>

      <article className="card">
        <h2 style={{ marginTop: 0 }}>실제 사례 ({result.count}건)</h2>
        <div className="grid">
          {result.cases.map((item) => (
            <div key={item.id} className="card">
              <strong>
                {item.region} / {item.style} / {item.areaPy}평 / {item.scope}
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
          <p className="muted">출처: 공개 정가표/실지불 사례/공개 후기</p>
          <p className="muted">표본수: {result.count}건</p>
          <p className="muted">갱신일: 2026-04-21</p>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>다음 질문</h2>
          <p className="muted">철거/목공/조명 등 옵션 범위를 좁혀 추가 견적 시뮬레이션을 진행할까요?</p>
        </div>
      </article>

      <article className="grid grid-2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>견적 검증</h2>
          <p className="muted">공사 견적 텍스트를 넣으면 누락/주의 항목을 분석합니다.</p>
          <textarea
            className="textarea"
            rows={6}
            value={estimateText}
            onChange={(e) => setEstimateText(e.target.value)}
            placeholder="예: 철거 1,200만원, 목공 3,100만원, 조명 별도..."
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
          <p className="muted">비교 결과를 기반으로 인테리어 업체에 상담을 요청합니다.</p>
          <textarea
            className="textarea"
            rows={4}
            value={leadMessage}
            onChange={(e) => setLeadMessage(e.target.value)}
            placeholder="시공 범위, 입주 일정, 선호 자재를 적어주세요."
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
