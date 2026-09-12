import React, { useMemo } from "react";
import { Calculator, Percent } from "lucide-react";
import { TiltCard, Field } from "../../ui/primitives.jsx";
import { safeNum, clamp, formatETB } from "../../lib/utils.js";

function PricingSection({ basePrice, setBasePrice, distanceKm, setDistanceKm, ratePerKm, setRatePerKm, feePercent, setFeePercent, taxPercent, setTaxPercent }) {
  const pricing = useMemo(() => {
    const base = clamp(safeNum(basePrice), 0, 1_000_000);
    const km = clamp(safeNum(distanceKm), 0, 50_000);
    const rate = clamp(safeNum(ratePerKm), 0, 1_000_000);
    const feePct = clamp(safeNum(feePercent), 0, 100);
    const taxPct = clamp(safeNum(taxPercent), 0, 100);

    const distanceCost = km * rate;
    const sub = base + distanceCost;
    const fee = (sub * feePct) / 100;
    const taxable = sub + fee;
    const tax = (taxable * taxPct) / 100;
    const total = taxable + tax;

    return {
      base,
      km,
      rate,
      feePct,
      taxPct,
      distanceCost,
      sub,
      fee,
      taxable,
      tax,
      total,
    };
  }, [basePrice, distanceKm, ratePerKm, feePercent, taxPercent]);

  return (
    <section className="wp-peak wp-reveal" id="pricing">
      <div className="wp-peak-head">
        <div>
          <span className="wp-route-chip">Pricing · Distance + automatic %</span>
          <h2>Price percentage dashboard</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            Set the base price and distance, then the service fee (%) and tax (%) calculate automatically.
          </p>
        </div>
        <div className="wp-eta">
          <span className="wp-eta-label">Total</span>
          <span className="wp-eta-num">{formatETB(pricing.total)}</span>
        </div>
      </div>

      <div className="wp-peak-grid">
        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <Calculator size={18} strokeWidth={2} />
            <h3>Inputs</h3>
          </div>
          <div className="wp-form">
            <Field label="Base price" hint="Example: item price or minimum fee">
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                min={0}
              />
            </Field>

            <Field label="Distance (km)" hint="Delivery distance">
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                min={0}
              />
            </Field>

            <Field label="Rate per km" hint="Cost per km">
              <input
                type="number"
                value={ratePerKm}
                onChange={(e) => setRatePerKm(e.target.value)}
                min={0}
              />
            </Field>

            <Field label="Service fee (%)" hint="Calculated on subtotal">
              <input
                type="number"
                value={feePercent}
                onChange={(e) => setFeePercent(e.target.value)}
                min={0}
                max={100}
              />
            </Field>

            <Field label="Tax (%)" hint="Calculated after service fee">
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                min={0}
                max={100}
              />
            </Field>

            <div className="wp-mini">
              Tip: you can rename “service fee” to “percentage” or “commission” once you confirm the exact wording.
            </div>
          </div>
        </TiltCard>

        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <Percent size={18} strokeWidth={2} />
            <h3>Breakdown</h3>
          </div>
          <div className="wp-dashboard">
            <div className="wp-row">
              <span>Distance cost</span>
              <b>{formatETB(pricing.distanceCost)}</b>
            </div>
            <div className="wp-row">
              <span>Subtotal (base + distance)</span>
              <b>{formatETB(pricing.sub)}</b>
            </div>
            <div className="wp-row">
              <span>Service fee ({pricing.feePct}%)</span>
              <b>{formatETB(pricing.fee)}</b>
            </div>
            <div className="wp-row">
              <span>Taxable amount</span>
              <b>{formatETB(pricing.taxable)}</b>
            </div>
            <div className="wp-row">
              <span>Tax ({pricing.taxPct}%)</span>
              <b>{formatETB(pricing.tax)}</b>
            </div>
            <div className="wp-row total">
              <span>Total</span>
              <b>{formatETB(pricing.total)}</b>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

export default PricingSection;
