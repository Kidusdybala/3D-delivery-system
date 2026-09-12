import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Filter,
  Phone,
  ShoppingBag,
  Star,
  Tag,
} from "lucide-react";
import {
  CATEGORIES,
  formatPrice,
  loadProducts,
} from "./products.js";

function placeholderFor(category) {
  const prompts = {
    perfume: "luxury perfume glass bottle on dark marble, studio lighting, premium fragrance, gold accents, 8k product shot",
    router: "modern tri-band wifi router, futuristic design, led status lights, desk setup, glowing antenna, 8k product photo",
    watch: "luxury automatic watch on dark leather pad, macro detail, sapphire crystal reflections, studio product photography 8k",
  };
  const p = prompts[category] || prompts.watch;
  const size = "landscape_4_3";
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(p)}&image_size=${size}`;
}

function ProductCard({ product }) {
  const cat = CATEGORIES.find((c) => c.id === product.category) || CATEGORIES[0];
  const imgSrc = product.image || placeholderFor(product.category);
  return (
    <article className="wp-prod-card wp-dark-card">
      <div className="wp-prod-img">
        <img src={imgSrc} alt={product.model} loading="lazy" />
        <span className="wp-prod-badge">{cat.label}</span>
      </div>
      <div className="wp-prod-body">
        <div className="wp-prod-brand">{product.brand}</div>
        <h4 className="wp-prod-name">{product.model}</h4>
        <div className="wp-prod-quality">
          <Star size={12} fill="#ffd166" stroke="#ffd166" /> {product.quality}
        </div>
        {product.description && (
          <p className="wp-prod-desc">{product.description}</p>
        )}
        <div className="wp-prod-foot">
          <div className="wp-prod-price">
            <Tag size={14} /> {formatPrice(product.price, product.currency)}
          </div>
          <a className="wp-prod-phone" href={`tel:${encodeURIComponent(product.phone)}`}>
            <Phone size={12} /> {product.phone}
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProductsShowcase({ onSeeAll, limit = 6 }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const shown = useMemo(() => {
    return products.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }, [products, limit]);

  if (!shown.length) return null;

  return (
    <section className="wp-section" id="shop">
      <div className="wp-section-inner">
        <div className="wp-section-head" style={{ marginBottom: 28 }}>
          <div className="wp-tag"><ShoppingBag size={12} /> Shop</div>
          <h2 className="wp-section-title">Featured products</h2>
          <p className="wp-section-desc">
            Three lines we carry — perfumes, Wi-Fi routers, and watches. Call the number on any card to order.
          </p>
        </div>

        <div className="wp-product-grid">
          {shown.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {onSeeAll && (
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <button className="wp-cta-btn wp-secondary" onClick={onSeeAll}>
              View full shop →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ShopPage({ onNav }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setProducts(loadProducts());
    const handler = () => setProducts(loadProducts());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const shown = useMemo(() => {
    const sorted = products.slice().sort((a, b) => b.createdAt - a.createdAt);
    if (filter === "all") return sorted;
    return sorted.filter((p) => p.category === filter);
  }, [products, filter]);

  const counts = useMemo(() => {
    const base = { all: products.length };
    CATEGORIES.forEach((c) => (base[c.id] = products.filter((p) => p.category === c.id).length));
    return base;
  }, [products]);

  const shopStyles = `
    .ws-root { background: #0b0f1a; min-height: 100vh; color: #e6ecff; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
    .ws-wrap { max-width: 1200px; margin: 0 auto; padding: 32px clamp(18px, 4vw, 40px) 80px; }
    .ws-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .ws-brand { font-weight: 800; font-size: 22px; letter-spacing: -0.01em; }
    .ws-brand .accent { color: #ff9f3a; }
    .ws-hero { background: linear-gradient(135deg, rgba(255,159,58,0.12), rgba(96,124,246,0.08)); border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 28px; margin-bottom: 28px; }
    .ws-hero h1 { margin: 0 0 6px; font-size: clamp(26px, 4vw, 34px); letter-spacing: -0.02em; }
    .ws-hero p { margin: 0; color: #a6b0c7; }
    .ws-filters { display: inline-flex; flex-wrap: wrap; gap: 4px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 4px; border-radius: 14px; margin-bottom: 24px; }
    .ws-filter { padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; color: #a6b0c7; transition: all .15s ease; border: 0; background: transparent; }
    .ws-filter.active { background: linear-gradient(135deg, #ff9f3a, #ff7a1f); color: #1a1306; }
    .ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
    .ws-empty { grid-column: 1/-1; padding: 60px 20px; text-align: center; color: #8992ab; border: 1px dashed rgba(255,255,255,0.06); border-radius: 18px; }
    .ws-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #e6ecff; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all .18s ease; font-size: 14px; font-weight: 600; white-space: nowrap; font-family: inherit; }
    .ws-btn:hover { background: rgba(255,159,58,0.08); border-color: rgba(255,159,58,0.35); color: #ffd2a3; }
    .ws-btn svg { flex-shrink: 0; }
    @media (max-width: 720px) {
      .ws-wrap { padding-top: 14px; padding-bottom: 60px; }
      .ws-top { gap: 8px; margin-bottom: 20px; }
      .ws-brand { order: -1; width: 100%; font-size: 18px; text-align: center; }
      .ws-hero { padding: 20px 18px; border-radius: 18px; }
      .ws-filters { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; }
      .ws-filters::-webkit-scrollbar { display: none; }
      .ws-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
      .ws-empty { padding: 40px 16px; }
      .ws-btn { padding: 9px; font-size: 13.5px; }
      .ws-btn span { display: none; }
      .ws-btn svg { width: 18px; height: 18px; }
      .ws-btn.admin-btn { margin-left: auto; }
    }
    @media (max-width: 420px) {
      .ws-grid { grid-template-columns: 1fr; }
      .ws-brand { font-size: 17px; }
    }
  `;

  return (
    <div className="ws-root">
      <style>{shopStyles}</style>
      <div className="ws-wrap">
        <div className="ws-top">
          <button className="ws-btn" onClick={() => onNav?.("home")}>
            <ArrowLeft size={16} /> <span>Back to Waypoint</span>
          </button>
          <div className="ws-brand">Way<span className="accent">point</span> · Shop</div>
          <button className="ws-btn admin-btn" onClick={() => onNav?.("admin")}>
            <Filter size={16} /> <span>Admin</span>
          </button>
        </div>

        <div className="ws-hero">
          <h1>Perfumes · Wi-Fi routers · Watches</h1>
          <p>Quality products, prices, and contact numbers. Tap the phone on any card to call directly.</p>
        </div>

        <div className="ws-filters" role="tablist">
          <button className={`ws-filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All ({counts.all})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`ws-filter ${filter === c.id ? "active" : ""}`}
              onClick={() => setFilter(c.id)}
            >
              {c.label} ({counts[c.id] || 0})
            </button>
          ))}
        </div>

        <div className="ws-grid wp-product-grid">
          {shown.length === 0 ? (
            <div className="ws-empty">
              <ShoppingBag size={36} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div>No products in this category yet. They'll appear here as the admin adds them.</div>
            </div>
          ) : (
            shown.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
