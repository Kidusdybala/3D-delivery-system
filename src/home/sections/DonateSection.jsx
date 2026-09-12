import React from "react";
import { HeartHandshake, FileText, QrCode } from "lucide-react";
import { TiltCard, Field, BrandBadge, QrPattern } from "../../ui/primitives.jsx";
import { PAYMENT_METHODS } from "../../lib/constants.js";
import { formatETB, safeNum } from "../../lib/utils.js";

function DonateSection({ bankAmount, setBankAmount, donationAmount, setDonationAmount, donationMethod, setDonationMethod, docUnlocked, setDocUnlocked }) {
  return (
    <section className="wp-peak wp-reveal" id="donate">
      <div className="wp-peak-head">
        <div>
          <span className="wp-route-chip">Donation · Strategy document</span>
          <h2>Donate to download the strategy</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            This is a front-end demo unlock (no real payment processing yet). Once you confirm payment,
            the download link appears.
          </p>
        </div>
      </div>

      <div className="wp-peak-grid">
        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <HeartHandshake size={18} strokeWidth={2} />
            <h3>Donation</h3>
          </div>
          <div className="wp-form">
            <Field label="Donation amount">
              <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} min={0} />
            </Field>

            <Field label="Method">
              <select value={donationMethod} onChange={(e) => setDonationMethod(e.target.value)}>
                <option value="telebirr">Telebirr</option>
                <option value="cbebirr">CBE Birr</option>
                <option value="hellocash">HelloCash</option>
                <option value="bank_qr">Bank QR (choose a bank above)</option>
              </select>
            </Field>

            <div className="span-2 wp-bank-note">
              Another donation option: call or message us directly and we’ll send a custom invoice link.
            </div>

            <div className="wp-form-actions span-2">
              <button
                type="button"
                className="wp-scan-btn"
                onClick={() => setDocUnlocked(true)}
              >
                Confirm I paid {formatETB(safeNum(donationAmount))}
              </button>
              {docUnlocked ? (
                <button
                  type="button"
                  className="wp-scan-btn ghost"
                  onClick={() => setDocUnlocked(false)}
                >
                  Lock
                </button>
              ) : null}
            </div>
          </div>
        </TiltCard>

        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <FileText size={18} strokeWidth={2} />
            <h3>Strategy document</h3>
          </div>
          {docUnlocked ? (
            <div className="wp-dashboard">
              <div className="wp-row total">
                <span>Access granted</span>
                <b>Unlocked</b>
              </div>
              <a className="wp-link" href="/peak-strategy-document.txt" download>
                <FileText size={16} strokeWidth={2} /> Download document
              </a>
              <div className="wp-bank-note">
                Replace this placeholder file with your real strategy document later.
              </div>
            </div>
          ) : (
            <div className="wp-dashboard">
              <div className="wp-row">
                <span>Status</span>
                <b>Locked</b>
              </div>
              <div className="wp-bank-note">
                Donate to unlock the download.
              </div>
            </div>
          )}
        </TiltCard>
      </div>
    </section>
  );
}

export default DonateSection;
