import React from "react";
import { MapPin, Phone, Send, Landmark, MessageSquare, Video } from "lucide-react";
import { TiltCard } from "../../ui/primitives.jsx";

function ContactSection() {
  return (
    <section className="wp-peak wp-reveal" id="contact">
      <div className="wp-peak-head">
        <div>
          <span className="wp-route-chip">Contact · Location</span>
          <h2>Contact & location</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            Add your exact address and phone numbers here when you’re ready.
          </p>
        </div>
      </div>

      <div className="wp-contact-grid">
        <TiltCard className="wp-contact-card">
          <div className="wp-contact-row">
            <MapPin size={18} strokeWidth={2} />
            <b>Location</b>
          </div>
          <div className="wp-bank-note">
            Addis Ababa, Ethiopia (placeholder) — we can embed an exact map once you share the address.
          </div>
          <div className="wp-links">
            <a className="wp-link" href="https://www.google.com/maps" target="_blank" rel="noreferrer">
              <MapPin size={16} strokeWidth={2} /> Open Google Maps
            </a>
          </div>
        </TiltCard>

        <TiltCard className="wp-contact-card">
          <div className="wp-contact-row">
            <Phone size={18} strokeWidth={2} />
            <b>Phone</b>
          </div>
          <div className="wp-bank-note">+251 9XX XXX XXX (placeholder)</div>
          <div className="wp-links">
            <a className="wp-link" href="tel:+251900000000">
              <Phone size={16} strokeWidth={2} /> Call
            </a>
            <a className="wp-link" href="sms:+251900000000">
              <MessageSquare size={16} strokeWidth={2} /> SMS
            </a>
          </div>

          <div className="wp-contact-row" style={{ marginTop: 10 }}>
            <Send size={18} strokeWidth={2} />
            <b>Social</b>
          </div>
          <div className="wp-links">
            <a className="wp-link" href="#" onClick={(e) => e.preventDefault()}>
              <Send size={16} strokeWidth={2} /> Telegram
            </a>
            <a className="wp-link" href="#" onClick={(e) => e.preventDefault()}>
              <Video size={16} strokeWidth={2} /> TikTok
            </a>
            <a className="wp-link" href="#" onClick={(e) => e.preventDefault()}>
              <MessageSquare size={16} strokeWidth={2} /> Facebook
            </a>
          </div>
        </TiltCard>
      </div>

      <div style={{ marginTop: 14 }}>
        <TiltCard className="wp-bank-card" style={{ maxWidth: "340px" }}>
          <div className="wp-contact-row">
            <Landmark size={18} strokeWidth={2} />
            <b>Bank in person</b>
          </div>
          <div className="wp-bank-note">
            Visit any major Ethiopian bank — Commercial Bank of Ethiopia, Awash, Dashen, or others listed above.
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

export default ContactSection;
