import React from "react";
import { TiltCard } from "../../ui/primitives.jsx";
import { FEATURES } from "../../lib/constants.js";

function FeaturesSection() {
  return (
    <section className="wp-features wp-reveal" id="features">
      <h2>Built for the whole route</h2>
      <div className="wp-feature-grid">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <TiltCard
              className="wp-feature-card wp-reveal"
              key={f.title}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="wp-feature-icon">
                <Icon size={18} strokeWidth={2} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesSection;
