import React, { useEffect, useRef, useState } from "react";
import { Banknote, CheckCircle2 } from "lucide-react";
import { PAYMENT_METHODS } from "../lib/constants.js";
import { formatETB } from "../lib/utils.js";
import { BrandBadge, QrPattern } from "./primitives.jsx";

const paymentMobileStyles = `
  .wp-scan-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    text-align: center;
    width: 100%;
    min-width: 0;
  }
  .wp-scanner {
    position: relative;
    width: 190px;
    height: 190px;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(11,18,36,0.5);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .wp-scanner.scanning { border-color: rgba(255,159,58,0.5); }
  .wp-scanner.success {
    border-color: rgba(79,224,168,0.5);
    box-shadow: 0 0 0 4px rgba(79,224,168,0.12);
  }
  .wp-scan-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: #ff9f3a;
    color: #1a1306;
    border: none;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    transition: all .15s ease;
    font-family: inherit;
    white-space: nowrap;
  }
  .wp-scan-btn:hover { filter: brightness(1.08); }
  .wp-scan-btn:disabled { opacity: 0.6; cursor: default; }
  .wp-scan-btn.ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    color: #a6b0c7;
  }
  .wp-scan-btn.ghost:hover { border-color: rgba(255,159,58,0.35); color: #ffd2a3; }
  .wp-scan-status { font-size: 13.5px; max-width: 240px; color: #e6ecff; }
  .wp-scan-note { font-size: 11px; color: #8992ab; opacity: 0.8; }
  .wp-cash-badge {
    width: 190px;
    height: 190px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(11,18,36,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a6b0c7;
    transition: border-color 0.2s, color 0.2s;
  }
  .wp-cash-badge.done {
    color: #4fe0a8;
    border-color: rgba(79,224,168,0.5);
  }
  @media (max-width: 720px) {
    .wp-scanner { width: 160px; height: 160px; }
    .wp-cash-badge { width: 160px; height: 160px; }
    .wp-scan-btn { padding: 9px 16px; font-size: 13px; width: 100%; max-width: 280px; }
    .wp-scan-status { font-size: 13px; max-width: 220px; }
  }
  @media (max-width: 420px) {
    .wp-scanner { width: 140px; height: 140px; }
    .wp-cash-badge { width: 140px; height: 140px; }
    .wp-scan-status { font-size: 12.5px; max-width: 200px; }
    .wp-scan-note { font-size: 10.5px; }
  }
`;

function ScannerPanel({ method, waybill, amount }) {
  const [scanState, setScanState] = useState("idle");
  const timeoutRef = useRef(null);

  useEffect(() => {
    setScanState("idle");
    return () => clearTimeout(timeoutRef.current);
  }, [method]);

  function simulateScan() {
    setScanState("scanning");
    timeoutRef.current = setTimeout(() => setScanState("success"), 1200);
  }

  const methodLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label;

  return (
    <>
      <style>{paymentMobileStyles}</style>
      <div className="wp-scan-area">
        <BrandBadge id={method} size="lg" />
        <div className={`wp-scanner ${scanState}`}>
          <div className="wp-qr-wrap" style={{ opacity: scanState === "success" ? 0.15 : 1 }}>
            <QrPattern seed={`${waybill}-${method}`} />
          </div>
          <div className="wp-scan-line" />
          <svg className="wp-scan-brackets" viewBox="0 0 100 100">
            <path d="M6,20 L6,6 L20,6" />
            <path d="M80,6 L94,6 L94,20" />
            <path d="M94,80 L94,94 L80,94" />
            <path d="M20,94 L6,94 L6,80" />
          </svg>
          {scanState === "success" && (
            <div className="wp-scan-success">
              <CheckCircle2 size={40} strokeWidth={1.6} />
            </div>
          )}
        </div>
        <div className="wp-scan-status">
          {scanState === "idle" && `Ask the customer to open ${methodLabel} and scan`}
          {scanState === "scanning" && "Scanning…"}
          {scanState === "success" && `Payment confirmed via ${methodLabel}`}
        </div>
        {scanState !== "success" ? (
          <button
            type="button"
            className="wp-scan-btn"
            onClick={simulateScan}
            disabled={scanState === "scanning"}
          >
            {scanState === "scanning" ? "Scanning…" : "Simulate scan"}
          </button>
        ) : (
          <button type="button" className="wp-scan-btn ghost" onClick={() => setScanState("idle")}>
            Scan another
          </button>
        )}
        <div className="wp-scan-note">Preview only — no real transaction is processed.</div>
      </div>
    </>
  );
}

function CashPanel({ amount }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <>
      <style>{paymentMobileStyles}</style>
      <div className="wp-scan-area">
        <div className={`wp-cash-badge ${confirmed ? "done" : ""}`}>
          {confirmed ? <CheckCircle2 size={40} strokeWidth={1.6} /> : <Banknote size={40} strokeWidth={1.4} />}
        </div>
        <div className="wp-scan-status">
          {confirmed ? `Cash received — ${formatETB(amount)}` : `Collect ${formatETB(amount)} from the customer`}
        </div>
        {!confirmed ? (
          <button type="button" className="wp-scan-btn" onClick={() => setConfirmed(true)}>
            Confirm cash received
          </button>
        ) : (
          <button type="button" className="wp-scan-btn ghost" onClick={() => setConfirmed(false)}>
            Undo
          </button>
        )}
      </div>
    </>
  );
}

export { ScannerPanel, CashPanel };
