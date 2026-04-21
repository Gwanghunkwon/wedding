type TrackEventInput = {
  name: "compare_started" | "compare_result_viewed" | "lead_submitted" | "lead_answered" | "contract_case_uploaded";
  category: "wedding" | "interior" | "common";
  source?: "web" | "api" | "b2b";
};

export async function trackEvent(input: TrackEventInput) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        source: input.source ?? "web"
      })
    });
  } catch {
    // 분석 이벤트 실패는 사용자 플로우를 막지 않는다.
  }
}
