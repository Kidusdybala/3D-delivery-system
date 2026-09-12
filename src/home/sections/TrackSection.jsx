import React from "react";
import { STEPS } from "../../lib/constants.js";

function TrackSection() {
  return (
    <section className="wp-status wp-reveal" id="track">
      <div className="wp-status-head">
        <div>
          <span className="wp-route-chip">WP-2291 · Bole → Kazanchis</span>
          <h2>On the way — on schedule</h2>
        </div>
        <div className="wp-eta">
          <span className="wp-eta-num">14:38</span>
          <span className="wp-eta-label">Estimated arrival</span>
        </div>
      </div>

      <ol className="wp-timeline">
        {STEPS.map((step) => (
          <li className="wp-timeline-item" key={step.label}>
            <span className={`wp-dot ${step.status}`} />
            <div>
              <div className={`wp-step-label ${step.status === "pending" ? "pending" : ""}`}>
                {step.label}
              </div>
              <div className="wp-step-meta">{step.time} · {step.place}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default TrackSection;
