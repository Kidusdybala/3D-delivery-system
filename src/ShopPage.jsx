import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Filter,
  MapPin,
  Phone,
  ShoppingBag,
  Star,
  Tag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import {
  CATEGORIES,
  formatPrice,
  loadProducts,
} from "./products.js";
import { PAYMENT_METHODS, ETHIOPIA_BANKS } from "../lib/constants.js";
import { BankQr } from "../ui/primitives.jsx";

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

function ProductCard({ product, onAddToCart, cartQty }) {
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
      <div className="wp-pactions" style={{ padding: "0 18px 18px", display: "flex", gap: 8, alignItems: "center" }}>
        {cartQty > 0 ? (
          <>
            <button
              type="button"
              className="ws-btn"
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => onAddToCart(product, 1)}
            >
              <Plus size={14} /> Qty {cartQty}
            </button>
            <button
              type="button"
              className="ws-btn"
              onClick={() => onAddToCart(product, -1)}
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            className="ws-btn primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => onAddToCart(product, 1)}
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        )}
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
          {shown.map((p) => <ProductCard key={p.id} product={p} onAddToCart={() => {}} cartQty={0} />)}
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
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("telebirr");

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

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  function handleAddToCart(product, delta) {
    setPurchased(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((i) => i.id !== product.id);
        }
        return prev.map((i) => i.id === product.id ? { ...i, quantity: newQty } : i);
      }
      if (delta <= 0) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function handleCheckout() {
    if (!cart.length) return;
    setShowCart(false);
    setPurchased(true);
  }

  const shopStyles = `
    .ws-root { background: #0b0f1a; min-height: 100vh; color: #e6ecff; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
    .ws-wrap { max-width: 1200px; margin: 0 auto; padding: 32px clamp(18px, 4vw, 40px) 80px; }
    .ws-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .ws-brand { display: inline-flex; align-items: center; gap: 5px; font-weight: 800; font-size: 22px; letter-spacing: -0.01em; }
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
    .ws-cart-btn { position: fixed; bottom: 24px; right: 24px; z-index: 30; display: inline-flex; align-items: center; gap: 8px; background: #ff9f3a; color: #1a1306; border: none; padding: 14px 20px; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 30px rgba(255,159,58,0.3); transition: all .18s ease; }
    .ws-cart-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .ws-cart-badge { display: inline-flex; align-items: center; justify-content: center; background: #1a1306; color: #ff9f3a; width: 22px; height: 22px; border-radius: 50%; font-size: 12px; font-weight: 800; }
    .ws-cart-panel { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; background: #0b0f1a; border-top: 1px solid rgba(255,255,255,0.08); max-height: 85vh; overflow-y: auto; padding: 24px max(18px, env(safe-area-inset-left)) 100px max(18px, env(safe-area-inset-right)); transform: translateY(100%); transition: transform .25s ease; }
    .ws-cart-panel.open { transform: translateY(0); }
    .ws-cart-overlay { position: fixed; inset: 0; background: rgba(5,8,16,0.6); backdrop-filter: blur(4px); z-index: 39; }
    .ws-cart-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .ws-cart-head h2 { margin: 0; font-size: 22px; font-family: 'Fraunces', serif; font-weight: 600; }
    .ws-cart-item { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .ws-cart-item-img { width: 60px; height: 60px; border-radius: 10px; background: rgba(255,159,58,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; color: #a6b0c7; overflow: hidden; }
    .ws-cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
    .ws-cart-item-info { flex: 1; min-width: 0; }
    .ws-cart-item-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ws-cart-item-price { color: #ff9f3a; font-size: 13px; font-weight: 700; }
    .ws-cart-item-qty { display: flex; align-items: center; gap: 8px; }
    .ws-cart-item-qty button { width: 28px; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: #e6ecff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .ws-cart-item-qty span { font-weight: 600; min-width: 20px; text-align: center; }
    .ws-cart-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; }
    .ws-cart-total { font-size: 20px; font-weight: 800; }
    .ws-cart-total-label { color: #a6b0c7; font-size: 13px; font-weight: 600; }
    .ws-cart-total-value { color: #ff9f3a; }
    .ws-checkout-btn { background: #ff9f3a; color: #1a1306; border: none; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .18s ease; }
    .ws-checkout-btn:hover { filter: brightness(1.1); }
    .ws-purchase-success { text-align: center; padding: 40px 20px; }
    .ws-purchase-success h2 { font-size: 24px; margin: 12px 0 6px; color: #fff; font-family: 'Fraunces', serif; }
    .ws-purchase-success p { color: #a6b0c7; margin-bottom: 24px; }
    .ws-payment-section { margin-top: 30px; }
    .ws-payment-head { text-align: center; margin-bottom: 24px; }
    .ws-payment-amount { font-size: 32px; font-weight: 800; color: #ff9f3a; font-family: 'IBM Plex Mono', monospace; }
    .ws-payment-methods { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 28px; }
    .ws-payment-method { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #a6b0c7; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s ease; }
    .ws-payment-method.active { background: rgba(255,159,58,0.1); border-color: rgba(255,159,58,0.4); color: #ffd2a3; }
    @media (max-width: 720px) {
      .ws-wrap { padding-top: 14px; padding-bottom: 60px; }
      .ws-top { gap: 8px; margin-bottom: 20px; }
      .ws-brand { order: -1; width: 100%; font-size: 18px; text-align: center; justify-content: center; }
      .ws-hero { padding: 20px 18px; border-radius: 18px; }
      .ws-filters { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; }
      .ws-filters::-webkit-scrollbar { display: none; }
      .ws-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
      .ws-empty { padding: 40px 16px; }
      .ws-btn { padding: 9px; font-size: 13.5px; }
      .ws-btn span { display: none; }
      .ws-btn svg { width: 18px; height: 18px; }
      .ws-btn.admin-btn { margin-left: auto; }
      .ws-cart-btn { bottom: 16px; right: 16px; padding: 12px 16px; font-size: 13px; }
      .ws-cart-panel { padding: 20px 16px 100px 16px; }
      .ws-cart-item { gap: 8px; }
      .ws-cart-footer { flex-direction: column; align-items: stretch; }
      .ws-cart-footer > * { width: 100%; }
    }
    @media (max-width: 420px) {
      .ws-grid { grid-template-columns: 1fr; }
      .ws-brand { font-size: 17px; }
      .ws-cart-item-img { width: 50px; height: 50px; }
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
          <div className="ws-brand"><MapPin size={18} strokeWidth={2} style={{ color: "#ff9f3a" }} /> Way<span className="accent">point</span> · Shop</div>
          <button className="ws-btn admin-btn" onClick={() => onNav?.("admin")}>
            <Filter size={16} /> <span>Admin</span>
          </button>
        </div>

        <div className="ws-hero">
          <h1>Perfumes · Wi-Fi routers · Watches</h1>
          <p>Quality products, prices, and contact numbers. Add to cart and check out — see payment QR codes after purchase.</p>
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

        {purchased && (
          <div className="ws-purchase-success wp-reveal">
            <CheckCircle2 size={48} strokeWidth={1.5} style={{ color: "#4fe0a8" }} />
            <h2>Purchase Confirmed</h2>
            <p>Scan the bank QR code below to complete payment.</p>
          </div>
        )}

        {purchased && (
          <div className="ws-payment-section wp-reveal">
            <div className="ws-payment-head">
              <div className="ws-payment-amount">{formatPrice(cartTotal)}</div>
              <div style={{ color: "#a6b0c7", fontSize: 14, marginTop: 4 }}>Total amount — pay any bank below</div>
            </div>
            <div className="ws-payment-methods">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`ws-payment-method ${paymentMethod === m.id ? "active" : ""}`}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div style={{ color: "#8992ab", fontSize: 13, marginBottom: 16, textAlign: "center" }}>Scan any bank QR code below to pay {formatPrice(cartTotal)}:</div>
            <div className="wp-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {ETHIOPIA_BANKS.slice(0, 6).map((b) => (
                <div key={b.id} style={{ background: "#131a2d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <b style={{ fontSize: 13.5 }}>{b.hint}</b>
                    <span style={{ fontSize: 12, color: "#8992ab" }}>{b.name}</span>
                  </div>
                  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "#131a2d", aspectRatio: "1/1", maxWidth: 180, margin: "0 auto", width: "100%", display: "grid", placeItems: "center" }}>
                    <BankQr bankId={b.id} seed={`${b.id}-${cartTotal}-${paymentMethod}`} alt={`${b.name} QR`} />
                  </div>
                  <div style={{ fontSize: 12, color: "#8992ab", textAlign: "center" }}>Pay {formatPrice(cartTotal)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ws-grid wp-product-grid">
          {shown.length === 0 ? (
            <div className="ws-empty">
              <ShoppingBag size={36} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div>No products in this category yet. They'll appear here as the admin adds them.</div>
            </div>
          ) : (
            shown.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={handleAddToCart}
                cartQty={cart.find((i) => i.id === p.id)?.quantity || 0}
              />
            ))
          )}
        </div>
      </div>

      {cartCount > 0 && !purchased && (
        <button className="ws-cart-btn" onClick={() => setShowCart(true)}>
          <ShoppingBag size={18} /> Cart
          <span className="ws-cart-badge">{cartCount}</span>
        </button>
      )}

      {showCart && (
        <>
          <div className="ws-cart-overlay" onClick={() => setShowCart(false)} />
          <div className={`ws-cart-panel ${showCart ? "open" : ""}`}>
            <div className="ws-cart-head">
              <h2>Your Cart</h2>
              <button className="ws-btn" onClick={() => setShowCart(false)}>
                <Trash2 size={16} /> Close
              </button>
            </div>
            {cart.map((item) => (
              <div className="ws-cart-item" key={item.id}>
                <div className="ws-cart-item-img">
                  {item.image ? (
                    <img src={item.image} alt={item.model} />
                  ) : (
                    <ShoppingBag size={18} />
                  )}
                </div>
                <div className="ws-cart-item-info">
                  <div className="ws-cart-item-name">{item.model}</div>
                  <div className="ws-cart-item-price">{formatPrice(item.price)}</div>
                </div>
                <div className="ws-cart-item-qty">
                  <button onClick={() => handleAddToCart(item, -1)}><Minus size={12} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAddToCart(item, 1)}><Plus size={12} /></button>
                </div>
                <div style={{ minWidth: 70, textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
            <div className="ws-cart-footer">
              <div>
                <div className="ws-cart-total-label">Total</div>
                <div className="ws-cart-total"><span className="ws-cart-total-value">{formatPrice(cartTotal)}</span></div>
              </div>
              <button className="ws-checkout-btn" onClick={handleCheckout}>
                <CreditCard size={16} /> Purchase — {formatPrice(cartTotal)}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}