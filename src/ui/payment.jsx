import React, { useEffect, useRef, useState } from "react";
import { Banknote, CheckCircle2 } from "lucide-react";
import { PAYMENT_METHODS } from "../lib/constants.js";
import { formatETB } from "../lib/utils.js";
import { BrandBadge, QrPattern } from "./primitives.jsx";

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
  );
}

function CashPanel({ amount }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
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
  );
}

export { ScannerPanel, CashPanel };
