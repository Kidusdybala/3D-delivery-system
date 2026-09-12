import React, { useState } from "react";
import { ArrowLeft, Lock, MapPin, Check, User } from "lucide-react";
import {
  DEFAULT_USERNAME,
  DEFAULT_PASSWORD,
  checkAdminCredentials,
  setAdminAuthed,
} from "./products.js";

const loginStyles = `
  .wa-root { background: #0b0f1a; min-height: 100vh; color: #e6ecff; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  .wa-wrap { max-width: 1200px; margin: 0 auto; padding: 32px clamp(18px, 4vw, 40px) 80px; }
  .wa-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
  .wa-brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 22px; letter-spacing: -0.01em; color: #fff; }
  .wa-brand .accent { color: #ff9f3a; }
  .wa-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #e6ecff; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all .18s ease; font-size: 14px; font-weight: 600; }
  .wa-btn:hover { background: rgba(255,159,58,0.08); border-color: rgba(255,159,58,0.35); color: #ffd2a3; }
  .wa-btn.primary { background: #ff9f3a; color: #1a1306; border-color: #ff9f3a; }
  .wa-btn.primary:hover { background: #ffb363; color: #1a1306; border-color: #ffb363; }
  .wa-btn.primary[disabled] { opacity: 0.6; cursor: not-allowed; }
  .wa-login { max-width: 440px; margin: 6vh auto 0; }
  .wa-card { background: #131a2d; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 32px; box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
  .wa-card h2 { margin: 0 0 6px; font-size: 24px; display: flex; align-items: center; gap: 8px; }
  .wa-muted { color: #8992ab; font-size: 14px; margin-bottom: 22px; line-height: 1.5; }
  .wa-muted code { color: #ffd2a3; background: rgba(255,159,58,0.08); padding: 2px 8px; border-radius: 6px; font-size: 12.5px; }
  .wa-field { margin-bottom: 16px; }
  .wa-field label { display: block; font-size: 13px; color: #a6b0c7; margin-bottom: 6px; font-weight: 600; letter-spacing: 0.02em; }
  .wa-input { width: 100%; box-sizing: border-box; background: #0b1224; border: 1px solid rgba(255,255,255,0.08); color: #e6ecff; padding: 13px 14px 13px 40px; border-radius: 12px; font-size: 14px; outline: none; transition: border .15s ease, box-shadow .15s ease; }
  .wa-input:focus { border-color: rgba(255,159,58,0.55); box-shadow: 0 0 0 4px rgba(255,159,58,0.08); }
  .wa-input-wrap { position: relative; }
  .wa-input-icon { position: absolute; top: 50%; left: 14px; transform: translateY(-50%); color: #6b7590; pointer-events: none; }
  .wa-error { color: #ff9b9b; font-size: 13px; margin-top: 12px; display: flex; align-items: center; gap: 6px; background: rgba(255,100,100,0.06); padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,100,100,0.15); }
  .wa-divider { display: flex; align-items: center; gap: 10px; margin: 22px 0 18px; color: #5a6479; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }
  .wa-divider::before, .wa-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .wa-hint { background: rgba(96,124,246,0.06); border: 1px solid rgba(96,124,246,0.15); padding: 12px 14px; border-radius: 12px; color: #a6b0c7; font-size: 12.5px; line-height: 1.6; }
  .wa-hint b { color: #e6ecff; }
  .wa-gate { background: linear-gradient(135deg, rgba(255,159,58,0.12), rgba(96,124,246,0.08)); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 26px; margin-bottom: 24px; text-align: center; }
  .wa-gate h1 { margin: 6px 0; font-size: clamp(24px, 4vw, 30px); letter-spacing: -0.02em; }
  .wa-gate p { margin: 0; color: #a6b0c7; font-size: 14px; }
  .wa-btn svg { flex-shrink: 0; }
  @media (max-width: 720px) {
    .wa-wrap { padding-top: 14px; padding-bottom: 60px; }
    .wa-top { gap: 8px; margin-bottom: 20px; }
    .wa-brand { order: -1; width: 100%; font-size: 18px; text-align: center; }
    .wa-back-btn { padding: 9px; font-size: 13.5px; }
    .wa-back-btn span { display: none; }
    .wa-back-btn svg { width: 18px; height: 18px; }
    .wa-card { padding: 24px 18px; border-radius: 18px; }
    .wa-gate { padding: 20px; border-radius: 18px; }
    .wa-login { margin: 4vh auto 0; }
    .wa-input { padding: 12px 14px 12px 40px; font-size: 14px; }
  }
  @media (max-width: 420px) {
    .wa-wrap { padding-left: 14px; padding-right: 14px; }
    .wa-card { padding: 20px 16px; }
    .wa-gate { padding: 18px; }
    .wa-btn { padding: 8px 10px; font-size: 12.5px; }
  }
  `;

export default function AdminLoginPage({ onNav }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (checkAdminCredentials({ username, password })) {
        setAdminAuthed(true);
        setLoading(false);
        window.location.hash = "#/admin";
      } else {
        setLoading(false);
        setError("Invalid username or password. Try the defaults below.");
      }
    }, 320);
  }

  return (
    <div className="wa-root">
      <style>{loginStyles}</style>
      <div className="wa-wrap">
        <div className="wa-top">
          <button className="wa-btn wa-back-btn" onClick={() => onNav?.("home")}>
            <ArrowLeft size={16} /> Back to Waypoint
          </button>
          <div className="wa-brand">
            <MapPin size={18} strokeWidth={2} style={{ color: "#ff9f3a" }} /> Way<span className="accent">point</span> · Admin
          </div>
          <div style={{ width: 140 }} />
        </div>

        <div className="wa-gate">
          <Lock size={28} style={{ color: "#ff9f3a" }} />
          <h1>Protected portal</h1>
          <p>Sign in with your admin credentials to manage the product catalogue.</p>
        </div>

        <div className="wa-login">
          <div className="wa-card">
            <h2><Lock size={18} style={{ color: "#ff9f3a" }} /> Admin sign in</h2>
            <div className="wa-muted">
              This area is restricted to Waypoint administrators. Unauthorised access is logged.
            </div>

            <form onSubmit={handleSubmit}>
              <div className="wa-field">
                <label>Username</label>
                <div className="wa-input-wrap">
                  <User size={16} className="wa-input-icon" />
                  <input
                    className="wa-input"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    autoFocus
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="wa-field">
                <label>Password</label>
                <div className="wa-input-wrap">
                  <Lock size={16} className="wa-input-icon" />
                  <input
                    className="wa-input"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="wa-btn primary"
                style={{ width: "100%", justifyContent: "center", padding: "13px 14px", fontSize: 15 }}
                disabled={loading}
              >
                <Check size={16} /> {loading ? "Signing in…" : "Sign in to admin"}
              </button>

              {error && <div className="wa-error">⚠ {error}</div>}

              <div className="wa-divider">Default access</div>

              <div className="wa-hint">
                <div><b>Username:</b> <code style={{ color: "#ffd2a3", background: "rgba(255,159,58,0.08)", padding: "1px 6px", borderRadius: 5 }}>{DEFAULT_USERNAME}</code></div>
                <div><b>Password:</b> <code style={{ color: "#ffd2a3", background: "rgba(255,159,58,0.08)", padding: "1px 6px", borderRadius: 5 }}>{DEFAULT_PASSWORD}</code></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
