import React from "react";
import { MessageSquare, Mic, Video, FileText } from "lucide-react";
import { TiltCard, Field } from "../../ui/primitives.jsx";

function FeedbackSection({ feedbackText, setFeedbackText, feedbackItems, setFeedbackItems, addFeedbackFiles }) {
  return (
    <section className="wp-peak wp-reveal" id="feedback">
      <div className="wp-peak-head">
        <div>
          <span className="wp-route-chip">Feedback · Voice / video</span>
          <h2>Customer feedback</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            Upload a short voice note or video testimonial and it will preview immediately.
          </p>
        </div>
      </div>

      <div className="wp-peak-grid">
        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <Mic size={18} strokeWidth={2} />
            <h3>Submit feedback</h3>
          </div>
          <div className="wp-form">
            <Field label="Text feedback" hint="Optional">
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tell us what went well (or what we should improve)" />
            </Field>

            <Field label="Voice/video files" hint="image/*, audio/* or video/*">
              <input
                type="file"
                accept="image/*,audio/*,video/*"
                multiple
                onChange={(e) => addFeedbackFiles(e.target.files)}
              />
            </Field>

            <div className="wp-form-actions span-2">
              <button
                type="button"
                className="wp-scan-btn"
                onClick={() => {
                  if (!feedbackText.trim()) return;
                  setFeedbackItems((list) => [
                    {
                      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                      name: "Text feedback",
                      type: "text/plain",
                      url: "",
                      body: feedbackText.trim(),
                      createdAt: new Date().toISOString(),
                    },
                    ...list,
                  ].slice(0, 8));
                  setFeedbackText("");
                }}
              >
                Save text feedback
              </button>
              <div className="wp-mini">Saved locally in this session.</div>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <Video size={18} strokeWidth={2} />
            <h3>Recent feedback</h3>
          </div>
          {feedbackItems.length ? (
            <div className="wp-feedback-list">
              {feedbackItems.map((f) => (
                <div className="wp-feedback-item" key={f.id}>
                  <b>{f.name}</b>
                  {f.type.startsWith("audio/") ? (
                    <audio controls src={f.url} />
                  ) : f.type.startsWith("video/") ? (
                    <video controls src={f.url} />
                  ) : f.type.startsWith("image/") ? (
                    <img src={f.url} alt={f.name} style={{ maxWidth: "100%", borderRadius: 8 }} />
                  ) : (
                    <div className="wp-mini">{f.body}</div>
                  )}
                  <div className="wp-mini">{new Date(f.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="wp-bank-note">No feedback submitted yet.</div>
          )}
        </TiltCard>
      </div>
    </section>
  );
}

export default FeedbackSection;
