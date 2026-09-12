import React, { useRef, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { hashStr, inFinderZone, mulberry32 } from "../lib/utils.js";
import { BRANDS } from "../lib/constants.js";

function TiltCard({ children, className, style }) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tx = ((x - rect.width / 2) / (rect.width / 2)) * 3;
    const ty = ((y - rect.height / 2) / (rect.height / 2)) * 3;
    el.style.transform = `translate(${tx}px, ${ty - 2}px) scale(1.01)`;
  }
  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0) scale(1)";
    el.style.touchAction = "";
  }
  function handleDown() {
    const el = ref.current;
    if (el) el.style.touchAction = "none";
  }

  return (
    <>
      <style>{`
        .wp-tilt-card {
          touch-action: manipulation;
          min-width: 0;
        }
        @media (hover: none) and (pointer: coarse) {
          .wp-tilt-card {
            transform: none !important;
          }
          .wp-tilt-card:hover {
            transform: none !important;
          }
        }
      `}</style>
      <div
        ref={ref}
        className={`${className || ''} wp-tilt-card`}
        style={style}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleLeave}
        onPointerCancel={handleLeave}
        onMouseLeave={handleLeave}
      >
        {children}
      </div>
    </>
  );
}

function Field({ label, hint, children }) {
  return (
    <>
      <style>{`
        .wp-field { display: grid; gap: 6px; margin-bottom: 13px; min-width: 0; max-width: 100%; }
        .wp-field-label { font-size: 12px; color: #a6b0c7; }
        .wp-field-hint { font-size: 11px; color: #a6b0c7; opacity: 0.85; }
        .wp-field input, .wp-field select, .wp-field textarea {
          width: 100%; box-sizing: border-box;
          background: #0b1224; border: 1px solid rgba(255,255,255,0.08);
          color: #e6ecff; padding: 10px 11px; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 13.5px;
        }
        .wp-field textarea { min-height: 96px; resize: vertical; }
        .wp-field input:focus-visible, .wp-field select:focus-visible, .wp-field textarea:focus-visible {
          outline: 2px solid rgba(255,154,68,0.55); outline-offset: 1px;
        }
        @media (max-width: 720px) {
          .wp-field input, .wp-field select, .wp-field textarea { font-size: 14px; }
        }
      `}</style>
      <label className="wp-field">
        <span className="wp-field-label">{label}</span>
        {hint ? <span className="wp-field-hint">{hint}</span> : null}
        {children}
      </label>
    </>
  );
}

function BrandBadge({ id, size = "sm" }) {
  const b = BRANDS[id];
  if (!b) return null;
  return (
    <span
      className={`wp-brand-badge wp-brand-${size}`}
      style={{ background: b.bg, color: b.fg }}
    >
      {b.mark}
    </span>
  );
}

function QrPattern({ seed }) {
  const size = 21;
  const cell = 100 / size;
  const rnd = mulberry32(Math.abs(hashStr(seed)) || 1);
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (inFinderZone(col, row, size)) continue;
      if (rnd() > 0.56) cells.push([col, row]);
    }
  }
  const finders = [[0, 0], [size - 7, 0], [0, size - 7]];

  return (
    <svg viewBox="0 0 100 100" className="wp-qr">
      <rect x="0" y="0" width="100" height="100" fill="#eef1f8" />
      {cells.map(([c, r]) => (
        <rect key={`${c}-${r}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#141a29" />
      ))}
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx * cell} y={fy * cell} width={cell * 7} height={cell * 7} fill="#141a29" />
          <rect x={(fx + 1) * cell} y={(fy + 1) * cell} width={cell * 5} height={cell * 5} fill="#eef1f8" />
          <rect x={(fx + 2) * cell} y={(fy + 2) * cell} width={cell * 3} height={cell * 3} fill="#141a29" />
        </g>
      ))}
    </svg>
  );
}

function BankQr({ bankId, seed, alt }) {
  const [broken, setBroken] = useState(false);
  const src = `/bank-qrs/${bankId}.png`;

  if (broken) return <QrPattern seed={seed} />;
  return (
    <img
      className="wp-qr-img"
      src={src}
      alt={alt}
      loading="lazy"
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
      onError={() => setBroken(true)}
    />
  );
}

const SYSTEM_PAGE_STYLES = `
  .sp-root {
    background: #0b0f1a;
    min-height: 100vh;
    color: #e6ecff;
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .sp-root::-webkit-scrollbar { display: none; width: 0; height: 0; }
  .sp-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 22px max(18px, env(safe-area-inset-right)) 80px max(18px, env(safe-area-inset-left));
  }
  .sp-header {
    position: sticky;
    top: 0;
    z-index: 15;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 0 14px;
    margin-bottom: 18px;
    flex-wrap: wrap;
    background: rgba(11,15,26,0.85);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-left: calc(-1 * max(18px, env(safe-area-inset-left)));
    margin-right: calc(-1 * max(18px, env(safe-area-inset-right)));
    padding-left: max(18px, env(safe-area-inset-left));
    padding-right: max(18px, env(safe-area-inset-right));
  }
  .sp-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .sp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #e6ecff;
    padding: 9px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all .18s ease;
    font-size: 13.5px;
    font-weight: 600;
    white-space: nowrap;
    font-family: inherit;
  }
  .sp-back:hover {
    background: rgba(255,159,58,0.08);
    border-color: rgba(255,159,58,0.35);
    color: #ffd2a3;
  }
  .sp-back-icon { flex-shrink: 0; }
  .sp-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -0.01em;
    color: #fff;
    font-family: 'Fraunces', serif;
    white-space: nowrap;
    order: 0;
  }
  .sp-brand .accent { color: #ff9f3a; }
  .sp-brand-sub { color: #8992ab; font-size: 13px; font-weight: 600; margin-left: 6px; font-family: 'Inter', sans-serif; }
  .sp-right { display: flex; align-items: center; gap: 8px; justify-content: flex-end; flex-wrap: wrap; min-width: 0; }
  .sp-hero {
    background: linear-gradient(135deg, rgba(255,159,58,0.12), rgba(96,124,246,0.08));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 22px;
    padding: 24px;
    margin-bottom: 24px;
  }
  .sp-hero h1 {
    margin: 0 0 6px;
    font-size: clamp(22px, 4vw, 34px);
    letter-spacing: -0.02em;
    color: #fff;
    font-family: 'Fraunces', serif;
    font-weight: 600;
  }
  .sp-hero p { margin: 0; color: #a6b0c7; font-size: 14px; line-height: 1.55; }
  .sp-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #e6ecff;
    padding: 9px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all .18s ease;
    font-size: 13.5px;
    font-weight: 600;
    font-family: inherit;
    white-space: nowrap;
  }
  .sp-btn:hover { background: rgba(255,159,58,0.08); border-color: rgba(255,159,58,0.35); color: #ffd2a3; }
  .sp-btn.primary { background: #ff9f3a; color: #1a1306; border-color: #ff9f3a; }
  .sp-btn.primary:hover { background: #ffb363; color: #1a1306; border-color: #ffb363; }
  .sp-btn.danger { border-color: rgba(246,96,96,0.35); color: #ffb7b7; }
  .sp-btn.danger:hover { background: rgba(246,96,96,0.08); }
  .sp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 22px; }
  .sp-stat {
    background: #131a2d;
    border: 1px solid rgba(255,255,255,0.06);
    padding: 14px 16px;
    border-radius: 14px;
  }
  .sp-stat-label { color: #8992ab; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .sp-stat-value { color: #fff; font-size: 22px; font-weight: 800; margin-top: 5px; }
  .sp-stat-value.accent { color: #ff9f3a; }
  .sp-filters, .sp-tabs {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 4px;
    border-radius: 14px;
    margin-bottom: 20px;
  }
  .sp-filter, .sp-tab {
    padding: 7px 12px;
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    color: #a6b0c7;
    transition: all .15s ease;
    border: 0;
    background: transparent;
    font-family: inherit;
    white-space: nowrap;
  }
  .sp-filter.active, .sp-tab.active {
    background: linear-gradient(135deg, #ff9f3a, #ff7a1f);
    color: #1a1306;
  }
  .sp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .sp-row > * { min-width: 0; }
  .sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
  .sp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .sp-grid2 .full { grid-column: 1/-1; }
  .sp-card { background: #131a2d; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 24px; box-shadow: 0 30px 80px rgba(0,0,0,0.35); }
  .sp-card h2 { margin: 0 0 6px; font-size: 20px; color: #fff; font-family: 'Fraunces', serif; font-weight: 600; }
  .sp-muted { color: #8992ab; font-size: 13px; line-height: 1.5; }
  .sp-field { margin-bottom: 13px; }
  .sp-field label { display: block; font-size: 12px; color: #a6b0c7; margin-bottom: 5px; font-weight: 600; letter-spacing: 0.02em; }
  .sp-input, .sp-select, .sp-textarea {
    width: 100%;
    box-sizing: border-box;
    background: #0b1224;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e6ecff;
    padding: 11px 13px;
    border-radius: 12px;
    font-size: 13.5px;
    outline: none;
    transition: border .15s ease, box-shadow .15s ease;
    font-family: inherit;
  }
  .sp-input:focus, .sp-select:focus, .sp-textarea:focus {
    border-color: rgba(255,159,58,0.55);
    box-shadow: 0 0 0 4px rgba(255,159,58,0.08);
  }
  .sp-textarea { min-height: 90px; resize: vertical; }
  .sp-input-wrap { position: relative; }
  .sp-input-icon { position: absolute; top: 50%; left: 13px; transform: translateY(-50%); color: #6b7590; pointer-events: none; }
  .sp-input.has-icon { padding-left: 40px; }
  .sp-modal-bg {
    position: fixed; inset: 0;
    background: rgba(5,8,16,0.75);
    backdrop-filter: blur(6px);
    z-index: 50;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
    overflow-y: auto;
  }
  .sp-modal {
    background: #131a2d;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    max-width: 620px;
    width: 100%;
    margin-top: 4vh;
  }
  .sp-modal-head {
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky;
    top: 0;
    background: #131a2d;
    z-index: 2;
    border-radius: 20px 20px 0 0;
  }
  .sp-modal-head h3 { margin: 0; font-size: 17px; color: #fff; font-family: 'Fraunces', serif; font-weight: 600; }
  .sp-modal-body { padding: 20px; }
  .sp-img-drop {
    border: 1.5px dashed rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color .15s ease, background .15s ease;
  }
  .sp-img-drop:hover { border-color: rgba(255,159,58,0.5); background: rgba(255,159,58,0.04); }
  .sp-img-drop.has { padding: 10px; }
  .sp-img-drop img { max-height: 180px; margin: 0 auto 8px; border-radius: 10px; display: block; max-width: 100%; }
  .sp-img-drop small { color: #8992ab; display: block; margin-top: 6px; font-size: 11.5px; }
  .sp-empty {
    grid-column: 1/-1;
    padding: 50px 20px;
    text-align: center;
    color: #8992ab;
    border: 1px dashed rgba(255,255,255,0.06);
    border-radius: 18px;
  }
  .sp-error { color: #ff9b9b; font-size: 13px; margin-top: 10px; }
  .sp-divider { display: flex; align-items: center; gap: 10px; margin: 20px 0 16px; color: #5a6479; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }
  .sp-divider::before, .sp-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .sp-hint { background: rgba(96,124,246,0.06); border: 1px solid rgba(96,124,246,0.15); padding: 12px 14px; border-radius: 12px; color: #a6b0c7; font-size: 12.5px; line-height: 1.6; }
  .sp-hint b { color: #e6ecff; }
  .sp-gate { background: linear-gradient(135deg, rgba(255,159,58,0.12), rgba(96,124,246,0.08)); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 24px; margin-bottom: 22px; text-align: center; }
  .sp-gate h1 { margin: 6px 0; font-size: clamp(22px, 4vw, 30px); letter-spacing: -0.02em; color: #fff; font-family: 'Fraunces', serif; font-weight: 600; }
  .sp-gate p { margin: 0; color: #a6b0c7; font-size: 14px; }
  .sp-login { max-width: 440px; margin: 4vh auto 0; }
  @media (max-width: 720px) {
    .sp-wrap { padding-top: 14px; }
    .sp-header { padding-top: 10px; padding-bottom: 12px; gap: 8px; }
    .sp-brand { width: 100%; order: -1; justify-content: center; font-size: 17px; }
    .sp-brand-sub { display: none; }
    .sp-back span { display: none; }
    .sp-back { padding: 9px; }
    .sp-back-icon { width: 18px; height: 18px; }
    .sp-right { flex: 1; min-width: 0; }
    .sp-right .sp-btn span { display: none; }
    .sp-hero { padding: 20px 18px; border-radius: 18px; }
    .sp-card { padding: 20px 18px; border-radius: 18px; }
    .sp-grid2 { grid-template-columns: 1fr; }
    .sp-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .sp-stat { padding: 12px 14px; border-radius: 12px; }
    .sp-stat-value { font-size: 20px; }
    .sp-row { flex-direction: column; align-items: stretch; }
    .sp-row > * { width: 100%; }
    .sp-filters, .sp-tabs { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; }
    .sp-filters::-webkit-scrollbar, .sp-tabs::-webkit-scrollbar { display: none; }
    .sp-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .sp-modal { margin-top: 2vh; }
    .sp-modal-head { padding: 14px 16px; }
    .sp-modal-body { padding: 16px; }
    .sp-gate { padding: 20px; }
  }
  @media (max-width: 420px) {
    .sp-stats { grid-template-columns: 1fr 1fr; }
    .sp-grid { grid-template-columns: 1fr; }
    .sp-btn { padding: 8px 10px; font-size: 12.5px; }
    .sp-primary { font-size: 13px; }
  }
  @media (max-width: 720px) {
    .sp-card { word-break: break-word; }
    .sp-card h2 { font-size: 18px; }
    .sp-grid2 .full { grid-column: 1/-1; }
  }
  .sp-card, .sp-input, .sp-select, .sp-textarea, .sp-grid, .sp-grid2, .sp-stat, .sp-hero, .sp-row, .sp-filters, .sp-tabs, .sp-modal, .sp-modal-body, .sp-modal-head { min-width: 0; max-width: 100%; }
  `;

const COMPONENT_STYLES = `
  .wp-field { display: grid; gap: 6px; margin-bottom: 13px; min-width: 0; max-width: 100%; }
  .wp-field-label { font-size: 12px; color: #a6b0c7; }
  .wp-field-hint { font-size: 11px; color: #a6b0c7; opacity: 0.85; }
  .wp-field input, .wp-field select, .wp-field textarea {
    width: 100%; box-sizing: border-box;
    background: #0b1224; border: 1px solid rgba(255,255,255,0.08);
    color: #e6ecff; padding: 10px 11px; border-radius: 10px;
    font-family: 'Inter', sans-serif; font-size: 13.5px;
  }
  .wp-field textarea { min-height: 96px; resize: vertical; }
  .wp-field input:focus-visible, .wp-field select:focus-visible, .wp-field textarea:focus-visible {
    outline: 2px solid rgba(255,154,68,0.55); outline-offset: 1px;
  }
  @media (max-width: 720px) {
    .wp-field input, .wp-field select, .wp-field textarea { font-size: 14px; }
  }
`;

function BackButton({ onBack, label = "Back", title }) {
  const handleClick = () => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#/";
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };
  return (
    <>
      <style>{`
        .wp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #e6ecff;
          padding: 9px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all .18s ease;
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
          font-family: inherit;
        }
        .wp-back-btn:hover {
          background: rgba(255,159,58,0.08);
          border-color: rgba(255,159,58,0.35);
          color: #ffd2a3;
        }
        .wp-back-btn svg { flex-shrink: 0; }
        @media (max-width: 720px) {
          .wp-back-btn { padding: 9px; font-size: 13.5px; }
          .wp-back-btn span { display: none; }
          .wp-back-btn svg { width: 18px; height: 18px; }
        }
      `}</style>
      <button
        type="button"
        className="wp-back-btn"
        onClick={handleClick}
        aria-label={title || label}
        title={title || label}
      >
        <ArrowLeft className="sp-back-icon" size={16} />
        <span>{label}</span>
      </button>
    </>
  );
}

function PageHeader({ title, subtitle, onBack, backLabel, rightSlot, showBack = true }) {
  return (
    <>
      <style>{`
        .wp-page-header {
          position: sticky;
          top: 0;
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px max(18px, env(safe-area-inset-left)) 14px max(18px, env(safe-area-inset-right));
          margin: 0 calc(-1 * max(18px, env(safe-area-inset-left))) 18px calc(-1 * max(18px, env(safe-area-inset-left)));
          margin-right: calc(-1 * max(18px, env(safe-area-inset-right)));
          flex-wrap: wrap;
          background: rgba(11,15,26,0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .wp-page-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .wp-page-header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: #fff;
          font-family: 'Fraunces', serif;
          white-space: nowrap;
        }
        .wp-page-header-brand .accent { color: #ff9f3a; }
        .wp-page-header-brand-sub { color: #8992ab; font-size: 13px; font-weight: 600; margin-left: 6px; font-family: 'Inter', sans-serif; }
        .wp-page-header-right { display: flex; align-items: center; gap: 8px; justify-content: flex-end; flex-wrap: wrap; min-width: 0; }
        @media (max-width: 720px) {
          .wp-page-header { padding-top: 10px; padding-bottom: 12px; gap: 8px; }
          .wp-page-header-brand { width: 100%; order: -1; justify-content: center; font-size: 17px; }
          .wp-page-header-brand-sub { display: none; }
          .wp-page-header-right { flex: 1; min-width: 0; }
        }
      `}</style>
      <header className="wp-page-header">
        <div className="wp-page-header-actions">
          {showBack && <BackButton onBack={onBack} label={backLabel || "Back"} />}
        </div>
        <div className="wp-page-header-brand">
          <MapPin size={18} strokeWidth={2} style={{ color: "#ff9f3a" }} />
          Way<span className="accent">point</span>
          {title && <span className="wp-page-header-brand-sub">· {title}</span>}
        </div>
        <div className="wp-page-header-right">
          {rightSlot}
        </div>
      </header>
    </>
  );
}

export {
  TiltCard,
  Field,
  BrandBadge,
  QrPattern,
  BankQr,
  SYSTEM_PAGE_STYLES,
  BackButton,
  PageHeader,
};
