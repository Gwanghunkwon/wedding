"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <section className="grid" style={{ maxWidth: 520, margin: "0 auto" }}>
      <article className="card">
        <h1 style={{ marginTop: 0 }}>소셜 로그인</h1>
        <p className="muted">구글, 카카오, 네이버 계정으로 로그인할 수 있습니다.</p>
        <div className="grid">
          <button className="button" type="button" onClick={() => signIn("google", { callbackUrl: "/" })}>
            구글로 로그인
          </button>
          <button className="button" type="button" onClick={() => signIn("kakao", { callbackUrl: "/" })}>
            카카오로 로그인
          </button>
          <button className="button" type="button" onClick={() => signIn("naver", { callbackUrl: "/" })}>
            네이버로 로그인
          </button>
        </div>
      </article>
    </section>
  );
}
