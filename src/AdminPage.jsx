import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  LogOut,
  Package,
  Plus,
  Save,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import {
  CATEGORIES,
  fileToDataURL,
  formatPrice,
  getCategory,
  isAdminAuthed,
  loadProducts,
  saveProducts,
  setAdminAuthed,
} from "./products.js";

const emptyForm = () => ({
  id: "",
  category: "perfume",
  brand: "",
  model: "",
  quality: "",
  price: "",
  currency: "USD",
  phone: "",
  description: "",
  image: "",
});

const adminStyles = `
  .wa-root { background: #0b0f1a; min-height: 100vh; color: #e6ecff; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  .wa-wrap { max-width: 1200px; margin: 0 auto; padding: 32px clamp(18px, 4vw, 40px) 80px; }
  .wa-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
  .wa-brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 22px; letter-spacing: -0.01em; color: #fff; }
  .wa-brand .accent { color: #ff9f3a; }
  .wa-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #e6ecff; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all .18s ease; font-size: 14px; font-weight: 600; }
  .wa-btn:hover { background: rgba(255,159,58,0.08); border-color: rgba(255,159,58,0.35); color: #ffd2a3; }
  .wa-btn.primary { background: #ff9f3a; color: #1a1306; border-color: #ff9f3a; }
  .wa-btn.primary:hover { background: #ffb363; color: #1a1306; border-color: #ffb363; }
  .wa-btn.danger { border-color: rgba(246,96,96,0.35); color: #ffb7b7; }
  .wa-btn.danger:hover { background: rgba(246,96,96,0.08); }
  .wa-hero { background: linear-gradient(135deg, rgba(255,159,58,0.12), rgba(96,124,246,0.08)); border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 28px; margin-bottom: 28px; }
  .wa-hero h1 { margin: 0 0 6px; font-size: clamp(26px, 4vw, 34px); letter-spacing: -0.02em; }
  .wa-hero p { margin: 0; color: #a6b0c7; }
  .wa-login { max-width: 420px; margin: 8vh auto; }
  .wa-card { background: #131a2d; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 28px; box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
  .wa-card h2 { margin: 0 0 6px; font-size: 22px; }
  .wa-muted { color: #8992ab; font-size: 14px; margin-bottom: 20px; }
  .wa-field { margin-bottom: 14px; }
  .wa-field label { display: block; font-size: 13px; color: #a6b0c7; margin-bottom: 6px; font-weight: 600; }
  .wa-input, .wa-select, .wa-textarea { width: 100%; box-sizing: border-box; background: #0b1224; border: 1px solid rgba(255,255,255,0.08); color: #e6ecff; padding: 12px 14px; border-radius: 12px; font-size: 14px; outline: none; transition: border .15s ease; }
  .wa-input:focus, .wa-select:focus, .wa-textarea:focus { border-color: rgba(255,159,58,0.55); box-shadow: 0 0 0 4px rgba(255,159,58,0.08); }
  .wa-textarea { min-height: 90px; resize: vertical; font-family: inherit; }
  .wa-error { color: #ff9b9b; font-size: 13px; margin-top: 10px; }
  .wa-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
  .wa-tabs { display: inline-flex; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 4px; border-radius: 14px; gap: 4px; flex-wrap: wrap; }
  .wa-tab { padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; color: #a6b0c7; transition: all .15s ease; border: 0; background: transparent; }
  .wa-tab.active { background: linear-gradient(135deg, #ff9f3a, #ff7a1f); color: #1a1306; }
  .wa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
  .wa-pcard { background: #131a2d; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform .18s ease, border-color .18s ease; }
  .wa-pcard:hover { transform: translateY(-2px); border-color: rgba(255,159,58,0.3); }
  .wa-pimg { height: 180px; background: linear-gradient(135deg, rgba(255,159,58,0.15), rgba(96,124,246,0.12)); display: flex; align-items: center; justify-content: center; color: #6b7590; position: relative; }
  .wa-pimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .wa-pbadge { position: absolute; top: 12px; left: 12px; background: rgba(11,15,26,0.8); border: 1px solid rgba(255,255,255,0.08); color: #e6ecff; padding: 5px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; backdrop-filter: blur(6px); }
  .wa-pbody { padding: 18px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .wa-pbrand { color: #8992ab; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .wa-pname { font-size: 16px; font-weight: 700; color: #fff; margin: 0; line-height: 1.3; }
  .wa-pquality { font-size: 12px; color: #8ee4a5; font-weight: 600; }
  .wa-pdesc { color: #a6b0c7; font-size: 13px; line-height: 1.5; min-height: 0; }
  .wa-pfoot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.06); }
  .wa-pprice { color: #ff9f3a; font-weight: 800; font-size: 20px; letter-spacing: -0.01em; }
  .wa-pphone { color: #a6b0c7; font-size: 12px; display: flex; align-items: center; gap: 4px; }
  .wa-pactions { display: flex; gap: 6px; padding: 0 18px 18px; }
  .wa-empty { grid-column: 1/-1; padding: 60px 20px; text-align: center; color: #8992ab; border: 1px dashed rgba(255,255,255,0.06); border-radius: 18px; }
  .wa-modal-bg { position: fixed; inset: 0; background: rgba(5,8,16,0.7); backdrop-filter: blur(6px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .wa-modal { background: #131a2d; border: 1px solid rgba(255,255,255,0.08); border-radius: 22px; max-width: 620px; width: 100%; max-height: 90vh; overflow: auto; }
  .wa-modal-head { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); position: sticky; top: 0; background: #131a2d; z-index: 2; }
  .wa-modal-head h3 { margin: 0; font-size: 18px; }
  .wa-modal-body { padding: 24px; }
  .wa-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .wa-grid2 .full { grid-column: 1/-1; }
  .wa-img-drop { border: 1.5px dashed rgba(255,255,255,0.12); border-radius: 14px; padding: 18px; text-align: center; cursor: pointer; transition: border-color .15s ease, background .15s ease; }
  .wa-img-drop:hover { border-color: rgba(255,159,58,0.5); background: rgba(255,159,58,0.04); }
  .wa-img-drop.has { padding: 10px; }
  .wa-img-drop img { max-height: 180px; margin: 0 auto 8px; border-radius: 10px; display: block; }
  .wa-img-drop small { color: #8992ab; display: block; margin-top: 6px; }
  @media (max-width: 560px) {
    .wa-grid2 { grid-template-columns: 1fr; }
    .wa-modal { max-height: 94vh; }
    .wa-top { gap: 8px; margin-bottom: 20px; }
    .wa-brand { order: -1; width: 100%; font-size: 18px; text-align: center; }
    .wa-btn.back-btn { padding: 9px; font-size: 13.5px; }
    .wa-btn.back-btn span { display: none; }
    .wa-btn.back-btn svg { width: 18px; height: 18px; }
    .wa-btn.logout-btn { margin-left: auto; }
    .wa-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .wa-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .wa-stat { padding: 12px 14px; border-radius: 12px; }
    .wa-stat-value { font-size: 20px; }
    .wa-row { flex-direction: column; align-items: stretch; }
    .wa-row > * { width: 100%; }
    .wa-tabs { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; }
    .wa-tabs::-webkit-scrollbar { display: none; }
    .wa-pcard { padding: 0; }
    .wa-modal { margin-top: 2vh; }
    .wa-modal-head { padding: 14px 16px; }
    .wa-modal-body { padding: 16px; }
    .wa-hero { padding: 20px 18px; border-radius: 18px; }
  }
  @media (max-width: 420px) {
    .wa-wrap { padding-left: 14px; padding-right: 14px; }
    .wa-stats { grid-template-columns: 1fr 1fr; }
    .wa-grid { grid-template-columns: 1fr; }
    .wa-btn { padding: 8px 10px; font-size: 12.5px; }
    .wa-pcard { padding: 0; }
  }
  .wa-btn svg { flex-shrink: 0; }
  .wa-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-bottom: 24px; }
  .wa-stat { background: #131a2d; border: 1px solid rgba(255,255,255,0.06); padding: 16px 18px; border-radius: 16px; }
  .wa-stat-label { color: #8992ab; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
  .wa-stat-value { color: #fff; font-size: 24px; font-weight: 800; margin-top: 6px; }
  .wa-stat-value.accent { color: #ff9f3a; }
`;

export default function AdminPage({ onNav }) {
  const [tab, setTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return products.slice().sort((a, b) => b.createdAt - a.createdAt);
    return products
      .filter((p) => p.category === tab)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [products, tab]);

  const counts = useMemo(() => {
    const base = { all: products.length };
    CATEGORIES.forEach((c) => (base[c.id] = products.filter((p) => p.category === c.id).length));
    return base;
  }, [products]);

  function handleLogout() {
    setAdminAuthed(false);
    window.location.hash = "#/admin/login";
  }

  function openAdd() {
    setForm(emptyForm());
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(p) {
    setForm({ ...emptyForm(), ...p });
    setFormError("");
    setFormOpen(true);
  }

  function handleDelete(p) {
    if (!confirm(`Delete "${p.model}"? This cannot be undone.`)) return;
    const next = products.filter((x) => x.id !== p.id);
    setProducts(next);
    saveProducts(next);
  }

  async function handleImageFile(file) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setFormError("Image is too large. Please use an image under 3MB.");
      return;
    }
    setUploadingImg(true);
    try {
      const dataUrl = await fileToDataURL(file);
      setForm((f) => ({ ...f, image: dataUrl }));
      setFormError("");
    } catch (e) {
      setFormError("Image couldn't be loaded. Try another file.");
    } finally {
      setUploadingImg(false);
    }
  }

  function saveForm() {
    const cleaned = {
      category: form.category,
      brand: (form.brand || "").trim(),
      model: (form.model || "").trim(),
      quality: (form.quality || "").trim(),
      price: Number(form.price) || 0,
      currency: form.currency || "USD",
      phone: (form.phone || "").trim(),
      description: (form.description || "").trim(),
      image: form.image || "",
    };
    if (!cleaned.brand) return setFormError("Brand is required.");
    if (!cleaned.model) return setFormError("Model is required.");
    if (!cleaned.quality) return setFormError("Brand & quality info is required.");
    if (!cleaned.price || cleaned.price < 0) return setFormError("Please enter a valid price.");
    if (!cleaned.phone) return setFormError("Phone number is required.");

    let next;
    if (form.id) {
      next = products.map((p) =>
        p.id === form.id ? { ...p, ...cleaned, updatedAt: Date.now() } : p
      );
    } else {
      next = [
        { ...cleaned, id: "p-" + Math.random().toString(36).slice(2, 9), createdAt: Date.now() },
        ...products,
      ];
    }
    setProducts(next);
    saveProducts(next);
    setFormOpen(false);
    setForm(emptyForm());
    setFormError("");
  }

  return (
    <div className="wa-root">
      <style>{adminStyles}</style>
      <div className="wa-wrap">
        <div className="wa-top">
          <button className="wa-btn back-btn" onClick={() => onNav?.("home")}>
            <ArrowLeft size={16} /> Back to Waypoint
          </button>
          <div className="wa-brand">
            Way<span className="accent">point</span> · Admin
          </div>
          <button className="wa-btn logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div className="wa-hero">
          <h1>Product manager</h1>
          <p>Add and edit products — they appear instantly on the Waypoint shop page.</p>
        </div>

        <div className="wa-stats">
          <div className="wa-stat">
            <div className="wa-stat-label">Total products</div>
            <div className="wa-stat-value accent">{counts.all}</div>
          </div>
          {CATEGORIES.map((c) => (
            <div className="wa-stat" key={c.id}>
              <div className="wa-stat-label">{c.label}</div>
              <div className="wa-stat-value">{counts[c.id] || 0}</div>
            </div>
          ))}
        </div>

        <div className="wa-row">
          <div className="wa-tabs" role="tablist">
            <button className={`wa-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
              All ({counts.all})
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`wa-tab ${tab === c.id ? "active" : ""}`}
                onClick={() => setTab(c.id)}
              >
                {c.label} ({counts[c.id] || 0})
              </button>
            ))}
          </div>
          <button className="wa-btn primary" onClick={openAdd}>
            <Plus size={16} /> Add product
          </button>
        </div>

        <div className="wa-grid">
          {filtered.length === 0 ? (
            <div className="wa-empty">
              <Package size={36} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div>No products in this category yet.</div>
              <button className="wa-btn primary" style={{ marginTop: 16 }} onClick={openAdd}>
                <Plus size={14} /> Add the first one
              </button>
            </div>
          ) : (
            filtered.map((p) => {
              const cat = getCategory(p.category);
              return (
                <div className="wa-pcard" key={p.id}>
                  <div className="wa-pimg">
                    {p.image ? (
                      <img src={p.image} alt={p.model} loading="lazy" />
                    ) : (
                      <ImageIcon size={36} />
                    )}
                    <span className="wa-pbadge">{cat.label}</span>
                  </div>
                  <div className="wa-pbody">
                    <div className="wa-pbrand">{p.brand}</div>
                    <h4 className="wa-pname">{p.model}</h4>
                    <div className="wa-pquality">★ {p.quality}</div>
                    {p.description && <div className="wa-pdesc">{p.description}</div>}
                    <div className="wa-pfoot">
                      <div className="wa-pprice">{formatPrice(p.price, p.currency)}</div>
                      <div className="wa-pphone">📞 {p.phone}</div>
                    </div>
                  </div>
                  <div className="wa-pactions">
                    <button className="wa-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => openEdit(p)}>
                      <Save size={14} /> Edit
                    </button>
                    <button className="wa-btn danger" onClick={() => handleDelete(p)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {formOpen && (
          <div className="wa-modal-bg" onClick={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
            <div className="wa-modal" role="dialog" aria-modal="true">
              <div className="wa-modal-head">
                <h3>{form.id ? "Edit product" : "Add a new product"}</h3>
                <button className="wa-btn" onClick={() => setFormOpen(false)} style={{ padding: "8px 10px" }}>
                  <X size={16} />
                </button>
              </div>
              <div className="wa-modal-body">
                <div className="wa-grid2">
                  <div className="wa-field">
                    <label>Category</label>
                    <select
                      className="wa-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="wa-field">
                    <label>Currency</label>
                    <select
                      className="wa-select"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    >
                      {["USD", "ETB", "EUR", "GBP", "AED", "NGN"].map((cur) => (
                        <option key={cur} value={cur}>{cur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="wa-field full">
                    <label>Brand</label>
                    <input
                      className="wa-input"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="e.g. Aurora Scents"
                    />
                  </div>

                  <div className="wa-field full">
                    <label>Model / Product name</label>
                    <input
                      className="wa-input"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      placeholder="e.g. Noir Éternel EDP 100ml"
                    />
                  </div>

                  <div className="wa-field full">
                    <label>Brand &amp; quality</label>
                    <input
                      className="wa-input"
                      value={form.quality}
                      onChange={(e) => setForm({ ...form, quality: e.target.value })}
                      placeholder="e.g. Premium · 96% longevity · 9.2/10"
                    />
                  </div>

                  <div className="wa-field">
                    <label>Price (number)</label>
                    <input
                      type="number"
                      min="0"
                      className="wa-input"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="wa-field">
                    <label>Phone number</label>
                    <input
                      className="wa-input"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 012-8410"
                    />
                  </div>

                  <div className="wa-field full">
                    <label>Description (optional)</label>
                    <textarea
                      className="wa-textarea"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short blurb about the product"
                    />
                  </div>

                  <div className="wa-field full">
                    <label>Quality image</label>
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageFile(e.target.files?.[0])}
                    />
                    <div
                      className={`wa-img-drop ${form.image ? "has" : ""}`}
                      onClick={() => fileInput.current?.click()}
                    >
                      {form.image ? (
                        <>
                          <img src={form.image} alt="preview" />
                          <small>Click to replace · {uploadingImg ? "Processing…" : "Saved"}</small>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={28} style={{ opacity: 0.7 }} />
                          <div style={{ marginTop: 8, fontWeight: 600 }}>
                            {uploadingImg ? "Processing image…" : "Click to upload image"}
                          </div>
                          <small>PNG / JPG / WEBP, up to 3MB. Saved to the product card.</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {formError && <div className="wa-error" style={{ marginTop: 8 }}>{formError}</div>}

                <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
                  <button className="wa-btn" onClick={() => setFormOpen(false)}>Cancel</button>
                  <button className="wa-btn primary" onClick={saveForm}>
                    <Save size={16} /> {form.id ? "Save changes" : "Add product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
