import React from "react";
import { QrCode } from "lucide-react";
import { TiltCard, Field, BankQr, QrPattern } from "../../ui/primitives.jsx";
import { ETHIOPIA_BANKS } from "../../lib/constants.js";
import { formatETB } from "../../lib/utils.js";

function BanksSection({ bankAmount, setBankAmount }) {

  return (
    <section className="wp-peak wp-reveal" id="banks">
      <div className="wp-peak-head">
        <div>
          <span className="wp-route-chip">Banks · QR codes</span>
          <h2>All banks’ QR codes</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            Drop real QR images into <span className="wp-mono">public/bank-qrs/&lt;bankId&gt;.png</span>.
            If an image isn’t found, the site shows a placeholder QR pattern.
          </p>
        </div>
        <div className="wp-eta">
          <span className="wp-eta-label">Amount</span>
          <span className="wp-eta-num">{formatETB(bankAmount)}</span>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <Field label="QR amount" hint="This only changes the placeholder seed">
          <input type="number" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} />
        </Field>
      </div>

      <div className="wp-grid-3">
        {ETHIOPIA_BANKS.map((b) => (
          <TiltCard className="wp-bank-card" key={b.id}>
            <div className="wp-bank-head">
              <b>{b.hint}</b>
              <span>{b.name}</span>
            </div>
            <div className="wp-bank-qr" aria-label={`${b.name} QR`}>
              <BankQr bankId={b.id} seed={`${b.id}-${bankAmount}`} alt={`${b.name} QR`} />
            </div>
            <div className="wp-bank-note">
              Replace with the real QR code image to meet the “all banks included” requirement.
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

export default BanksSection;
