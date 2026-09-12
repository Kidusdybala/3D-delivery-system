const homeStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .wp-root {
          --bg: #0b0f1a;
          --panel: #131a29;
          --panel-2: #1b2436;
          --line: rgba(234,237,245,0.09);
          --text: #eaedf5;
          --muted: #8793aa;
          --amber: #ff9a44;
          --mint: #4fe0a8;
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .wp-root * { box-sizing: border-box; max-width: 100%; }
        .wp-root img, .wp-root svg, .wp-root video, .wp-root audio, .wp-root canvas { max-width: 100%; display: block; }
        .wp-root h1, .wp-root h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .wp-mono { font-family: 'IBM Plex Mono', monospace; }

        .wp-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(10px);
          background: rgba(11,15,26,0.6);
        }
        .wp-logo {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: -0.01em;
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 0;
        }
        .wp-logo span { color: var(--amber); }
        .wp-nav-links { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .wp-nav-links button {
          background: none;
          border: none;
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 6px;
        }
        .wp-nav-links button:hover { color: var(--text); }
        .wp-nav-links button.active { color: var(--amber); }
        .wp-nav-cta {
          background: var(--amber);
          color: #241205;
          border: none;
          padding: 10px 18px;
          border-radius: 7px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .wp-nav-cta:hover { filter: brightness(1.08); }
        .wp-nav-toggle {
          display: none;
          background: none;
          border: 1px solid var(--line);
          color: var(--text);
          border-radius: 8px;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .wp-nav-mobile {
          display: none;
          position: sticky;
          top: 61px;
          z-index: 19;
          flex-direction: column;
          gap: 4px;
          padding: 14px 20px 20px;
          background: rgba(11,15,26,0.97);
          border-bottom: 1px solid var(--line);
        }
        .wp-nav-mobile button {
          background: none;
          border: none;
          color: var(--muted);
          text-align: left;
          font-size: 15px;
          padding: 12px 6px;
          border-bottom: 1px solid var(--line);
          cursor: pointer;
        }
        .wp-nav-mobile button.active { color: var(--amber); }
        .wp-nav-mobile .wp-nav-cta {
          margin-top: 12px;
          text-align: center;
          border-bottom: none;
          color: #241205;
        }

        .wp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .wp-hero { min-height: 92vh; }
        }
        .wp-hero-canvas-wrap {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .wp-hero-canvas {
          position: absolute;
          inset: 0;
          cursor: grab;
          touch-action: none;
        }
        .wp-hero-canvas.wp-dragging { cursor: grabbing; }
        .wp-vehicle-toggle {
          position: absolute;
          top: 24px;
          right: 32px;
          z-index: 3;
          display: flex;
          gap: 4px;
          background: rgba(19,26,41,0.6);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 4px;
          backdrop-filter: blur(6px);
        }
        .wp-vehicle-toggle button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 12.5px;
          font-family: 'Inter', sans-serif;
          padding: 7px 12px;
          border-radius: 7px;
          cursor: pointer;
        }
        .wp-vehicle-toggle button.active {
          background: var(--amber);
          color: #241205;
          font-weight: 600;
        }
        .wp-hero-hint {
          position: absolute;
          left: 50%;
          bottom: 190px;
          transform: translateX(-50%);
          z-index: 2;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: var(--muted);
          background: rgba(19,26,41,0.55);
          border: 1px solid var(--line);
          padding: 6px 12px;
          border-radius: 20px;
          pointer-events: none;
          opacity: 0.85;
          transition: opacity 0.4s ease;
        }
        .wp-hero-hint.wp-hidden { opacity: 0; }

        .wp-reveal {
          opacity: 0;
          transform: perspective(900px) rotateX(9deg) translateY(26px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .wp-reveal.wp-in {
          opacity: 1;
          transform: perspective(900px) rotateX(0deg) translateY(0);
        }
        .wp-hero-fade {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 30%, rgba(11,15,26,0) 0%, rgba(11,15,26,0.05) 60%, rgba(11,15,26,0.85) 100%),
            linear-gradient(to bottom, rgba(11,15,26,0) 0%, rgba(11,15,26,0.2) 70%, var(--bg) 100%);
          pointer-events: none;
        }
        .wp-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px 56px;
          display: grid;
          grid-template-columns: 1.2fr 0.9fr;
          gap: 40px;
          align-items: end;
        }
        .wp-hero h1 {
          font-size: clamp(34px, 5vw, 56px);
          line-height: 1.05;
          max-width: 11ch;
        }
        .wp-hero-sub {
          margin-top: 16px;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.55;
          max-width: 46ch;
        }
        .wp-track-box {
          background: rgba(19,26,41,0.72);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 18px 20px;
          backdrop-filter: blur(6px);
        }
        .wp-track-label {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .wp-track-input-row {
          display: flex;
          gap: 10px;
        }
        .wp-track-input-row input {
          flex: 1;
          min-width: 0;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 11px 12px;
          border-radius: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
        }
        .wp-track-input-row input::placeholder { color: #5c6478; }
        .wp-track-input-row input:focus-visible {
          outline: 2px solid var(--amber);
          outline-offset: 1px;
        }
        .wp-track-input-row button {
          background: var(--amber);
          color: #241205;
          border: none;
          padding: 0 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
        }
        .wp-track-input-row button:hover { filter: brightness(1.08); }
        .wp-track-input-row button:focus-visible {
          outline: 2px solid var(--text);
          outline-offset: 2px;
        }

        .wp-status {
          max-width: 1180px;
          margin: 0 auto;
          padding: 64px 32px 20px;
        }
        .wp-status-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
        }
        .wp-route-chip {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          color: var(--mint);
          background: rgba(79,224,168,0.08);
          border: 1px solid rgba(79,224,168,0.25);
          padding: 5px 10px;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        .wp-status-head h2 { font-size: 26px; }
        .wp-eta { text-align: right; }
        .wp-eta-num {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 34px;
          font-weight: 600;
          color: var(--amber);
        }
        .wp-eta-label { font-size: 13px; color: var(--muted); }

        .wp-timeline {
          list-style: none;
          display: flex;
          position: relative;
          padding: 24px 0 0;
          margin: 0;
        }
        .wp-timeline::before {
          content: '';
          position: absolute;
          top: 7px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: var(--line);
        }
        .wp-timeline-item {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          padding: 0 6px;
        }
        .wp-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--panel-2);
          border: 2px solid var(--muted);
          z-index: 1;
        }
        .wp-dot.done { background: var(--mint); border-color: var(--mint); }
        .wp-dot.current {
          background: var(--amber);
          border-color: var(--amber);
          box-shadow: 0 0 0 6px rgba(255,154,68,0.16);
          animation: wp-pulse 2s infinite;
        }
        @keyframes wp-pulse {
          0%, 100% { box-shadow: 0 0 0 5px rgba(255,154,68,0.16); }
          50% { box-shadow: 0 0 0 9px rgba(255,154,68,0.08); }
        }
        .wp-step-label { font-size: 13.5px; font-weight: 500; }
        .wp-step-label.pending { color: var(--muted); }
        .wp-step-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: var(--muted);
        }

        .wp-brand-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border-radius: 7px;
          flex-shrink: 0;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .wp-brand-sm { font-size: 10.5px; padding: 5px 8px; }
        .wp-brand-lg { font-size: 13px; padding: 7px 14px; border-radius: 8px; }

        .wp-pay {
          max-width: 1180px;
          margin: 0 auto;
          padding: 56px 32px 20px;
        }
        .wp-pay-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .wp-pay-head h2 { font-size: 26px; margin-top: 4px; }
        .wp-pay-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 26px;
          align-items: center;
          transition: transform 0.15s ease-out, border-color 0.15s;
          will-change: transform;
        }
        .wp-pay-methods { display: flex; flex-direction: column; gap: 10px; }
        .wp-pay-method {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
        }
        .wp-pay-method svg { flex-shrink: 0; color: var(--muted); }
        .wp-pay-method.active {
          border-color: rgba(255,154,68,0.4);
          background: rgba(255,154,68,0.07);
        }
        .wp-pay-method.active svg { color: var(--amber); }
        .wp-pay-method-label { display: block; font-size: 13.5px; font-weight: 500; }
        .wp-pay-method-hint { display: block; font-size: 12px; color: var(--muted); margin-top: 2px; }
        .wp-pay-divider { width: 1px; align-self: stretch; background: var(--line); }

        .wp-scan-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        .wp-scanner {
          position: relative;
          width: 190px;
          height: 190px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--panel-2);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wp-scanner.scanning { border-color: rgba(255,154,68,0.5); }
        .wp-scanner.success {
          border-color: rgba(79,224,168,0.5);
          box-shadow: 0 0 0 4px rgba(79,224,168,0.12);
        }
        .wp-qr-wrap { position: absolute; inset: 10%; transition: opacity 0.3s; }
        .wp-qr { width: 100%; height: 100%; display: block; border-radius: 4px; }
        .wp-scan-brackets {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          fill: none;
          stroke: var(--amber);
          stroke-width: 2.5;
          stroke-linecap: round;
          opacity: 0.85;
        }
        .wp-scan-line {
          position: absolute;
          left: 8%;
          right: 8%;
          height: 2px;
          top: 6%;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          opacity: 0;
        }
        .wp-scanner.scanning .wp-scan-line {
          opacity: 1;
          animation: wp-scanline 1.5s linear infinite;
        }
        @keyframes wp-scanline {
          0% { top: 8%; }
          100% { top: 88%; }
        }
        .wp-scan-success {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mint);
          animation: wp-pop 0.35s ease;
        }
        @keyframes wp-pop {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        .wp-cash-badge {
          width: 190px;
          height: 190px;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: var(--panel-2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: border-color 0.2s;
        }
        .wp-cash-badge.done {
          color: var(--mint);
          border-color: rgba(79,224,168,0.5);
          box-shadow: 0 0 0 4px rgba(79,224,168,0.12);
        }
        .wp-scan-status { font-size: 13.5px; max-width: 220px; color: var(--text); }
        .wp-scan-btn {
          background: var(--amber);
          color: #241205;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }
        .wp-scan-btn:disabled { opacity: 0.6; cursor: default; }
        .wp-scan-btn.ghost {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--muted);
          font-weight: 500;
        }
        .wp-scan-note { font-size: 11px; color: var(--muted); opacity: 0.8; }

        .wp-peak {
          max-width: 1180px;
          margin: 0 auto;
          padding: 70px 32px 20px;
        }
        .wp-peak-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .wp-peak-head h2 { font-size: 26px; margin-top: 4px; }

        .wp-peak-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 18px;
        }
        .wp-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 22px;
          transition: transform 0.15s ease-out, border-color 0.15s;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .wp-card:hover { border-color: rgba(255,154,68,0.25); }
        .wp-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wp-card-head h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
        }
        .wp-card-head svg { color: var(--amber); }
        .wp-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .wp-field {
          display: grid;
          gap: 6px;
        }
        .wp-field-label { font-size: 12px; color: var(--muted); }
        .wp-field-hint { font-size: 11px; color: var(--muted); opacity: 0.85; }
        .wp-field input, .wp-field select, .wp-field textarea {
          width: 100%;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 10px 11px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
        }
        .wp-field textarea { min-height: 96px; resize: vertical; }
        .wp-field input:focus-visible, .wp-field select:focus-visible, .wp-field textarea:focus-visible {
          outline: 2px solid rgba(255,154,68,0.55);
          outline-offset: 1px;
        }
        .wp-form .span-2 { grid-column: span 2; }
        .wp-form-actions { display: flex; gap: 10px; align-items: center; }

        .wp-mini {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--muted);
        }
        .wp-dashboard {
          display: grid;
          gap: 10px;
        }
        .wp-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: rgba(27,36,54,0.7);
        }
        .wp-row b { font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--text); }
        .wp-row span { color: var(--muted); font-size: 12.5px; }
        .wp-row.total {
          border-color: rgba(79,224,168,0.25);
          background: rgba(79,224,168,0.08);
        }
        .wp-row.total b { color: var(--mint); }

        .wp-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .wp-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--muted);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
        }
        .wp-pill.active {
          color: var(--text);
          border-color: rgba(255,154,68,0.4);
          background: rgba(255,154,68,0.08);
        }
        .wp-pill svg { color: var(--amber); }

        .wp-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .wp-bank-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px;
          display: grid;
          gap: 10px;
        }
        .wp-bank-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .wp-bank-head b { font-size: 13.5px; }
        .wp-bank-head span { font-size: 12px; color: var(--muted); }
        .wp-bank-qr {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--panel-2);
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
        }
        .wp-bank-qr .wp-qr, .wp-bank-qr .wp-qr-img { width: 100%; height: 100%; object-fit: cover; }
        .wp-bank-note { font-size: 12px; color: var(--muted); line-height: 1.5; }

        .wp-feedback-list { display: grid; gap: 10px; }
        .wp-feedback-item {
          border: 1px solid var(--line);
          background: rgba(19,26,41,0.6);
          border-radius: 14px;
          padding: 14px;
          display: grid;
          gap: 10px;
        }
        .wp-feedback-item b { font-size: 13px; }
        .wp-feedback-item audio, .wp-feedback-item video { width: 100%; }

        .wp-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .wp-contact-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 18px;
          display: grid;
          gap: 10px;
        }
        .wp-contact-row { display: flex; align-items: center; gap: 10px; color: var(--muted); }
        .wp-contact-row b { color: var(--text); font-weight: 600; }
        .wp-contact-row svg { color: var(--amber); }
        .wp-links { display: flex; flex-wrap: wrap; gap: 10px; }
        .wp-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 8px 12px;
          background: var(--panel-2);
          color: var(--text);
          text-decoration: none;
          font-size: 13px;
        }
        .wp-link:hover { border-color: rgba(255,159,58,0.35); }

        .wp-features {
          max-width: 1180px;
          margin: 0 auto;
          padding: 70px 32px 30px;
        }
        .wp-features h2 { font-size: 28px; margin-bottom: 30px; }
        .wp-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .wp-feature-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 22px;
          transition: transform 0.15s ease-out, border-color 0.15s;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .wp-feature-card:hover { border-color: rgba(255,154,68,0.3); }
        .wp-feature-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(255,154,68,0.1);
          color: var(--amber);
          margin-bottom: 16px;
        }
        .wp-feature-card h3 {
          font-size: 15.5px;
          font-weight: 600;
          margin: 0 0 8px;
          font-family: 'Inter', sans-serif;
        }
        .wp-feature-card p {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.5;
          margin: 0;
        }

        .wp-footer {
          max-width: 1180px;
          margin: 0 auto;
          padding: 46px 32px 40px;
          border-top: 1px solid var(--line);
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .wp-footer-brand { font-size: 13px; color: var(--muted); }
        .wp-footer-brand b { color: var(--text); font-family: 'Fraunces', serif; }
        .wp-socials { display: inline-flex; gap: 10px; align-items: center; }
        .wp-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--panel);
          border: 1px solid var(--line);
          color: var(--muted);
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .wp-social-btn:hover {
          transform: translateY(-2px);
          color: var(--text);
          border-color: var(--amber);
        }
        .wp-social-tg:hover { color: #2aabee; border-color: #2aabee; background: rgba(42,171,238,0.08); }
        .wp-social-tt:hover { color: #00f2ea; border-color: #00f2ea; background: rgba(0,242,234,0.06); box-shadow: 2px -2px 0 rgba(255,0,80,0.25); }
        .wp-social-fb:hover { color: #1877f2; border-color: #1877f2; background: rgba(24,119,242,0.08); }

        .wp-section { padding: 80px 0 0; }
        .wp-section-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 max(18px, env(safe-area-inset-left)) 0 max(18px, env(safe-area-inset-right));
        }
        .wp-section-head { text-align: center; max-width: 620px; margin: 0 auto 36px; }
        .wp-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,159,58,0.08); color: var(--amber);
          padding: 5px 12px; border-radius: 999px;
          border: 1px solid rgba(255,159,58,0.18);
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .wp-section-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0 0 12px;
          color: var(--text);
        }
        .wp-section-desc {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }
        .wp-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        .wp-prod-card { overflow: hidden; display: flex; flex-direction: column; }
        .wp-prod-img {
          height: 190px;
          position: relative;
          background: linear-gradient(135deg, rgba(255,159,58,0.12), rgba(96,124,246,0.1));
          display: flex; align-items: center; justify-content: center;
        }
        .wp-prod-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .wp-prod-badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(11,15,26,0.8);
          color: var(--text);
          border: 1px solid var(--line);
          padding: 4px 10px;
          font-size: 11px; font-weight: 700;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }
        .wp-prod-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .wp-prod-brand { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .wp-prod-name { margin: 0; font-size: 16px; font-weight: 700; line-height: 1.3; color: var(--text); }
        .wp-prod-quality { display: inline-flex; align-items: center; gap: 5px; color: #8ee4a5; font-size: 12px; font-weight: 600; }
        .wp-prod-desc { color: var(--muted); font-size: 13px; line-height: 1.5; margin: 2px 0 0; }
        .wp-prod-foot {
          margin-top: auto;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding-top: 12px;
          border-top: 1px dashed var(--line);
        }
        .wp-prod-price {
          display: inline-flex; align-items: center; gap: 6px;
          color: var(--amber);
          font-weight: 800;
          font-size: 19px;
          letter-spacing: -0.01em;
        }
        .wp-prod-phone {
          display: inline-flex; align-items: center; gap: 5px;
          color: var(--muted);
          font-size: 12px;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line);
          transition: all .15s ease;
        }
        .wp-prod-phone:hover {
          color: var(--text);
          border-color: rgba(255,159,58,0.35);
          background: rgba(255,159,58,0.06);
        }
        .wp-dark-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 18px;
          transition: transform 0.18s ease, border-color 0.18s ease;
        }
        .wp-dark-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255,159,58,0.3);
        }
        .wp-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--amber);
          color: #241205;
          border: 1px solid var(--amber);
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all .18s ease;
          font-family: inherit;
        }
        .wp-cta-btn:hover { filter: brightness(1.08); }
        .wp-cta-btn.wp-secondary {
          background: transparent;
          color: var(--amber);
          border: 1px solid rgba(255,159,58,0.35);
        }
        .wp-cta-btn.wp-secondary:hover {
          background: rgba(255,159,58,0.08);
        }

        .wp-peak-grid, .wp-feature-grid, .wp-contact-grid, .wp-grid-3, .wp-pay-panel, .wp-form, .wp-hero-content {
          min-width: 0;
          width: 100%;
        }
        .wp-card, .wp-feature-card, .wp-bank-card, .wp-contact-card, .wp-pay-methods, .wp-scan-area,
        .wp-timeline-item, .wp-track-box, .wp-pay-divider {
          min-width: 0;
          max-width: 100%;
        }
        .wp-nav, .wp-nav-mobile, .wp-hero, .wp-status, .wp-pay, .wp-peak, .wp-features, .wp-footer {
          width: 100%;
          min-width: 0;
          max-width: 100%;
        }
        .wp-nav {
          padding-left: max(18px, env(safe-area-inset-left));
          padding-right: max(18px, env(safe-area-inset-right));
        }
        .wp-nav-mobile {
          padding-left: max(20px, env(safe-area-inset-left));
          padding-right: max(20px, env(safe-area-inset-right));
        }
        .wp-hero-content, .wp-status, .wp-pay, .wp-peak, .wp-features, .wp-footer {
          padding-left: max(18px, env(safe-area-inset-left));
          padding-right: max(18px, env(safe-area-inset-right));
        }
        .wp-hero-hint { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90vw; }

        @media (max-width: 860px) {
          .wp-hero-content { grid-template-columns: 1fr; }
          .wp-feature-grid { grid-template-columns: 1fr 1fr; }
          .wp-peak-grid { grid-template-columns: 1fr; }
          .wp-grid-3 { grid-template-columns: 1fr 1fr; }
          .wp-contact-grid { grid-template-columns: 1fr; }
          .wp-timeline { flex-direction: column; align-items: flex-start; gap: 22px; }
          .wp-timeline::before { top: 0; bottom: 0; left: 6px; right: auto; width: 2px; height: auto; }
          .wp-timeline-item { flex-direction: row; text-align: left; align-items: center; width: 100%; }
          .wp-status-head { align-items: flex-start; }
          .wp-pay-head { align-items: flex-start; }
          .wp-eta { text-align: left; }
          .wp-pay-panel { grid-template-columns: 1fr; }
          .wp-pay-divider { width: auto; height: 1px; }
        }
        @media (max-width: 720px) {
          .wp-nav-links { display: none; }
          .wp-nav-cta-desktop { display: none; }
          .wp-nav-toggle { display: flex; }
          .wp-nav-mobile { display: flex; }
          .wp-form { grid-template-columns: 1fr; }
          .wp-form .span-2 { grid-column: span 1; }
          .wp-pay-panel { grid-template-columns: 1fr; padding: 20px; }
          .wp-pay-divider { width: auto; height: 1px; }
          .wp-grid-3 { grid-template-columns: 1fr 1fr; }
          .wp-feature-grid { grid-template-columns: 1fr 1fr; }
          .wp-contact-grid { grid-template-columns: 1fr; }
          .wp-hero-content { padding-bottom: 56px; }
          .wp-hero h1 { max-width: none; }
          .wp-track-input-row { flex-direction: column; }
          .wp-track-input-row button { padding: 11px 18px; }
        }
        @media (max-width: 520px) {
          .wp-feature-grid { grid-template-columns: 1fr; }
          .wp-nav { padding-top: 14px; padding-bottom: 14px; padding-left: max(18px, env(safe-area-inset-left)); padding-right: max(18px, env(safe-area-inset-right)); }
          .wp-hero-content, .wp-status, .wp-pay, .wp-features, .wp-footer {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }
          .wp-peak { padding-left: max(18px, env(safe-area-inset-left)); padding-right: max(18px, env(safe-area-inset-right)); }
          .wp-grid-3 { grid-template-columns: 1fr; }
          .wp-hero-hint { bottom: 160px; font-size: 11px; }
          .wp-vehicle-toggle { top: 16px; right: max(18px, env(safe-area-inset-right)); }
          .wp-vehicle-toggle button { padding: 6px 9px; font-size: 11.5px; }
          .wp-pay-methods { gap: 8px; }
          .wp-form { grid-template-columns: 1fr; }
          .wp-form .span-2 { grid-column: span 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wp-root * { animation: none !important; transition: none !important; }
        }
      `;

export default homeStyles;
