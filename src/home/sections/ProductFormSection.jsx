import React from "react";
import { MessageSquare, PackageCheck } from "lucide-react";
import { TiltCard, Field } from "../../ui/primitives.jsx";
import { PRODUCT_CATEGORIES, QUALITY_OPTIONS } from "../../lib/constants.js";
import { formatETB } from "../../lib/utils.js";

function ProductFormSection({ productCategory, setProductCategory, productPrice, setProductPrice, productModel, setProductModel, productPhone, setProductPhone, productBrand, setProductBrand, productQuality, setProductQuality, productRequests, submitProductRequest }) {
  return (
    <section className="wp-peak wp-reveal" id="products">
      <div className="wp-peak-head">
        <div>
          <span className="wp-route-chip">Products · Request form</span>
          <h2>Add the 3 products</h2>
          <p className="wp-hero-sub" style={{ marginTop: 10 }}>
            Capture: price, model, phone number, brand, and quality for each request.
          </p>
        </div>
      </div>

      <div className="wp-pills" style={{ marginBottom: 14 }}>
        {PRODUCT_CATEGORIES.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              className={`wp-pill ${productCategory === p.id ? "active" : ""}`}
              onClick={() => setProductCategory(p.id)}
            >
              <Icon size={16} strokeWidth={2} />
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="wp-peak-grid">
        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <MessageSquare size={18} strokeWidth={2} />
            <h3>Product request</h3>
          </div>
          <div className="wp-form">
            <Field label="Price">
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                min={0}
                placeholder="e.g. 2,500"
              />
            </Field>

            <Field label="Model">
              <input
                type="text"
                value={productModel}
                onChange={(e) => setProductModel(e.target.value)}
                placeholder="e.g. AX3000 / Series 6 / Dior Sauvage"
              />
            </Field>

            <Field label="Phone number" hint="How we contact the customer">
              <input
                type="tel"
                value={productPhone}
                onChange={(e) => setProductPhone(e.target.value)}
                placeholder="e.g. +251 9xx xxx xxx"
              />
            </Field>

            <Field label="Brand">
              <input
                type="text"
                value={productBrand}
                onChange={(e) => setProductBrand(e.target.value)}
                placeholder="e.g. Rolex / Casio / TP-Link"
              />
            </Field>

            <Field label="Brand & quality">
              <select value={productQuality} onChange={(e) => setProductQuality(e.target.value)}>
                {QUALITY_OPTIONS.map((q) => (
                  <option key={q.id} value={q.id}>{q.label}</option>
                ))}
              </select>
            </Field>

            <div className="wp-form-actions span-2">
              <button type="button" className="wp-scan-btn" onClick={submitProductRequest}>
                Add request
              </button>
              <div className="wp-mini">
                Required: model, phone, brand.
              </div>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="wp-card">
          <div className="wp-card-head">
            <PackageCheck size={18} strokeWidth={2} />
            <h3>Recent requests</h3>
          </div>
          {productRequests.length ? (
            <div className="wp-feedback-list">
              {productRequests.map((r) => (
                <div className="wp-feedback-item" key={r.id}>
                  <b>
                    {PRODUCT_CATEGORIES.find((p) => p.id === r.category)?.label || r.category}
                    {r.price ? ` · ${formatETB(r.price)}` : ""}
                  </b>
                  <div className="wp-mini">Model: {r.model}</div>
                  <div className="wp-mini">Brand: {r.brand} · Quality: {r.quality}</div>
                  <div className="wp-mini">Phone: {r.phone}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="wp-bank-note">
              No product requests yet — add one on the left.
            </div>
          )}
        </TiltCard>
      </div>
    </section>
  );
}

export default ProductFormSection;
