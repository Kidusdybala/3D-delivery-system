import React from "react";
import { TiltCard, BrandBadge } from "../../ui/primitives.jsx";
import { ScannerPanel, CashPanel } from "../../ui/payment.jsx";
import { PAYMENT_METHODS } from "../../lib/constants.js";
import { formatETB } from "../../lib/utils.js";

function PaySection({ payMethod, setPayMethod }) {
  return (
    <section className="wp-pay wp-reveal" id="pay">
      <div className="wp-pay-head">
        <div>
          <span className="wp-route-chip">WP-2291 · Pay on delivery</span>
          <h2>Scan to pay, or pay cash</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            Ethiopian couriers collect payment right at the door — a quick scan for mobile
            money, or cash confirmed on the spot.
          </p>
        </div>
        <div className="wp-eta">
          <span className="wp-eta-label">Amount due</span>
          <span className="wp-eta-num">{formatETB(640)}</span>
        </div>
      </div>

      <TiltCard className="wp-pay-panel">
        <div className="wp-pay-methods">
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                className={`wp-pay-method ${payMethod === m.id ? "active" : ""}`}
                onClick={() => setPayMethod(m.id)}
              >
                {m.id === "cash" ? (
                  <Icon size={17} strokeWidth={2} />
                ) : (
                  <BrandBadge id={m.id} size="sm" />
                )}
                <span>
                  <span className="wp-pay-method-label">{m.label}</span>
                  <span className="wp-pay-method-hint">{m.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="wp-pay-divider" />

        {payMethod === "cash" ? (
          <CashPanel amount={640} />
        ) : (
          <ScannerPanel method={payMethod} waybill="WP-2291" amount={640} />
        )}
      </TiltCard>
    </section>
  );
}

export default PaySection;
