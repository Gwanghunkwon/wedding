"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const getCallbackUrl = () => {
    if (typeof window === "undefined") return "/";
    const value = new URLSearchParams(window.location.search).get("callbackUrl");
    return value || "/";
  };

  return (
    <section className="gpt-frame">
      <aside className="gpt-sidebar">
        <div className="gpt-logo">Cost Compass</div>
        <button className="gpt-new-chat" type="button">
          + 새 견적 대화
        </button>
        <div className="gpt-history">
          <div className="gpt-history-item">강남 200명 웨딩 견적 비교</div>
          <div className="gpt-history-item">32평 인테리어 예산 시뮬레이션</div>
          <div className="gpt-history-item">옵션별 추가비용 분석</div>
        </div>
        <div className="muted">소셜 로그인 후 시작</div>
      </aside>

      <main className="gpt-main">
        <div className="gpt-top">모델: Cost Compass Assistant</div>
        <div className="gpt-thread">
          <div className="gpt-msg">
            <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 26 }}>무엇을 비교해볼까요?</h1>
            <p className="muted" style={{ margin: 0 }}>
              예식장과 인테리어 실지불 데이터를 바탕으로 비용 범위를 분석해드립니다.
            </p>
          </div>
        </div>
        <div className="gpt-composer-wrap">
          <div className="gpt-composer">
            <div className="muted">먼저 로그인해야 견적 시뮬레이션을 시작할 수 있습니다.</div>
            <div className="gpt-provider-buttons">
              <button className="button" type="button" onClick={() => signIn("google", { callbackUrl: getCallbackUrl() })}>
                구글로 로그인
              </button>
              <button className="button" type="button" onClick={() => signIn("kakao", { callbackUrl: getCallbackUrl() })}>
                카카오로 로그인
              </button>
              <button className="button" type="button" onClick={() => signIn("naver", { callbackUrl: getCallbackUrl() })}>
                네이버로 로그인
              </button>
            </div>
          </div>
          <div className="gpt-note">로그인 실패 시 OAuth Redirect URI와 Render ENV 설정을 확인하세요.</div>
        </div>
      </main>
    </section>
  );
}
