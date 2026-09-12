import React, { useRef, useState } from "react";
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
    <div
      ref={ref}
      className={className}
      style={style}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleLeave}
      onPointerCancel={handleLeave}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="wp-field">
      <span className="wp-field-label">{label}</span>
      {hint ? <span className="wp-field-hint">{hint}</span> : null}
      {children}
    </label>
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
      onError={() => setBroken(true)}
    />
  );
}

export {
  TiltCard,
  Field,
  BrandBadge,
  QrPattern,
  BankQr,
};
