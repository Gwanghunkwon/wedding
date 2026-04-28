"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
    <section className="gpt-frame">
      <aside className="gpt-sidebar">
        <div className="gpt-logo">Cost Compass</div>
        <button className="gpt-new-chat" type="button">
          + 새 웨딩 분석
        </button>
        <div className="gpt-history">
          <div className="gpt-history-item">강남 호텔 200명 견적</div>
          <div className="gpt-history-item">컨벤션 vs 호텔 비용 비교</div>
          <div className="gpt-history-item">스드메 옵션 최적화</div>
        </div>
        <div className="gpt-history">
          <Link href="/">홈으로</Link>
          <Link href="/interior">인테리어 비교</Link>
        </div>
      </aside>

      <main className="gpt-main">
        <div className="gpt-top">웨딩 비용 비교</div>
        <div className="gpt-thread">
          <div className="gpt-msg">
            <strong>핵심 요약</strong>
            <div className="grid grid-3" style={{ marginTop: 10 }}>
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
            </div>
          </div>

          <div className="gpt-msg">
            <strong>항목별 평균 비용</strong>
            <div className="grid grid-2" style={{ marginTop: 10 }}>
              <div className="card">식대: {formatKrw(result.averageByItem.mealCost)}</div>
              <div className="card">대관료: {formatKrw(result.averageByItem.hallCost)}</div>
              <div className="card">스드메: {formatKrw(result.averageByItem.sdmCost)}</div>
              <div className="card">옵션: {formatKrw(result.averageByItem.optionCost)}</div>
            </div>
          </div>

          <div className="gpt-msg">
            <strong>실제 사례 ({result.count}건)</strong>
            <div className="grid" style={{ marginTop: 10 }}>
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
          </div>

          <div className="gpt-msg">
            <strong>근거 데이터</strong>
            <p className="muted">출처: 참가격/제휴업체/사용자 실지불 사례</p>
            <p className="muted">표본수: {result.count}건</p>
            <p className="muted">갱신일: 2026-04-21</p>
          </div>
        </div>

        <div className="gpt-composer-wrap">
          <div className="gpt-composer">
            <div className="gpt-composer-row">
              <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option>강남</option>
                <option>강북</option>
                <option>지방</option>
              </select>
              <input className="input" type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} placeholder="하객 수" />
            </div>
            <div className="gpt-composer-row">
              <input className="input" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} placeholder="예산" />
              <button className="button" type="button" onClick={sendLead}>
                업체 문의 보내기
              </button>
            </div>
            <textarea
              className="textarea"
              rows={4}
              value={estimateText}
              onChange={(e) => setEstimateText(e.target.value)}
              placeholder="견적 텍스트를 입력하거나 이미지/.txt 파일을 업로드하세요."
            />
            <div className="gpt-composer-row">
              <input
                className="input"
                type="file"
                accept=".txt,image/*"
                onChange={(e) => {
                  void importEstimateFile(e.target.files?.[0] ?? null);
                }}
              />
              <button className="button" type="button" onClick={validateEstimate}>
                견적 검증 실행
              </button>
            </div>
            {ocrStatus && <p className="muted">{ocrStatus}</p>}
            {!!validationResult.length && (
              <ul>
                {validationResult.map((warning) => (
                  <li key={warning} className="muted">
                    {warning}
                  </li>
                ))}
              </ul>
            )}
            {validationMeta && <p className="muted">{validationMeta}</p>}
            {leadStatus && <p className="muted">{leadStatus}</p>}
          </div>
          <div className="gpt-note">옵션 조건을 추가할수록 예측 정확도가 올라갑니다.</div>
        </div>
      </main>
    </section>
  );
}
