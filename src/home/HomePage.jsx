import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, ShoppingBag, Lock, Send, Music2, Facebook } from "lucide-react";
import homeStyles from "./home.css.js";
import HeroSection from "./sections/HeroSection.jsx";
import TrackSection from "./sections/TrackSection.jsx";
import PaySection from "./sections/PaySection.jsx";
import PricingSection from "./sections/PricingSection.jsx";
import ProductFormSection from "./sections/ProductFormSection.jsx";
import BanksSection from "./sections/BanksSection.jsx";
import DonateSection from "./sections/DonateSection.jsx";
import FeedbackSection from "./sections/FeedbackSection.jsx";
import ContactSection from "./sections/ContactSection.jsx";
import FeaturesSection from "./sections/FeaturesSection.jsx";
import { ProductsShowcase } from "../ShopPage.jsx";
import { safeNum } from "../lib/utils.js";

function HomePage() {
  const [trackingValue, setTrackingValue] = useState("");
  const [hintHidden, setHintHidden] = useState(false);
  const [payMethod, setPayMethod] = useState("telebirr");
  const [vehicle, setVehicle] = useState("bike");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("track");

  const [basePrice, setBasePrice] = useState(450);
  const [distanceKm, setDistanceKm] = useState(6.8);
  const [ratePerKm, setRatePerKm] = useState(28);
  const [feePercent, setFeePercent] = useState(8);
  const [taxPercent, setTaxPercent] = useState(15);

  const [productCategory, setProductCategory] = useState("perfumes");
  const [productPrice, setProductPrice] = useState("");
  const [productModel, setProductModel] = useState("");
  const [productPhone, setProductPhone] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productQuality, setProductQuality] = useState("premium");
  const [productRequests, setProductRequests] = useState([]);

  const [bankAmount, setBankAmount] = useState(250);
  const [donationAmount, setDonationAmount] = useState(500);
  const [donationMethod, setDonationMethod] = useState("telebirr");
  const [docUnlocked, setDocUnlocked] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackItems, setFeedbackItems] = useState([]);

  const rootRef = useRef(null);
  const parallaxRef = useRef(null);

  const navLinks = [
    { id: "track", label: "Track" },
    { id: "pay", label: "Pay" },
    { id: "pricing", label: "Pricing" },
    { id: "products", label: "Products" },
    { id: "banks", label: "Banks" },
    { id: "donate", label: "Donate" },
    { id: "feedback", label: "Feedback" },
    { id: "contact", label: "Contact" },
    { id: "features", label: "Fleet" },
  ];

  function goTo(id) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function submitProductRequest() {
    const req = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: productCategory,
      price: safeNum(productPrice),
      model: productModel.trim(),
      phone: productPhone.trim(),
      brand: productBrand.trim(),
      quality: productQuality,
      createdAt: new Date().toISOString(),
    };

    if (!req.model || !req.phone || !req.brand) return;

    setProductRequests((list) => [req, ...list].slice(0, 12));
    setProductPrice("");
    setProductModel("");
    setProductPhone("");
    setProductBrand("");
  }

  function addFeedbackFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setFeedbackItems((list) => {
      const next = [...list];
      for (const f of files) {
        const url = URL.createObjectURL(f);
        next.unshift({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: f.name,
          type: f.type,
          url,
          createdAt: new Date().toISOString(),
        });
      }
      return next.slice(0, 8);
    });
  }

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const el = parallaxRef.current;
        if (el) {
          const y = Math.min(window.scrollY, 900);
          el.style.transform = `translateY(${y * 0.15}px) scale(1.06)`;
        }
        raf = null;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = rootRef.current
      ? rootRef.current.querySelectorAll(".wp-reveal")
      : [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wp-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="wp-root" ref={rootRef}>
      <style>{homeStyles}</style>
      <header className="wp-nav">
        <button className="wp-logo" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>
          Way<span>point</span>
        </button>
        <nav className="wp-nav-links">
          {navLinks.map((l) => (
            <button
              key={l.id}
              className={activeSection === l.id ? "active" : ""}
              onClick={() => goTo(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => window.location.hash = "#/shop"} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <ShoppingBag size={12} /> Shop
          </button>
          <button
            onClick={() => window.location.hash = "#/admin"}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, opacity: 0.75 }}
            title="Admin"
          >
            <Lock size={12} />
          </button>
        </nav>
        <button className="wp-nav-cta wp-nav-cta-desktop" onClick={() => goTo("track")}>
          Get the app
        </button>
        <button
          className="wp-nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && (
        <div className="wp-nav-mobile">
          {navLinks.map((l) => (
            <button
              key={l.id}
              className={activeSection === l.id ? "active" : ""}
              onClick={() => goTo(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--line)" }} onClick={() => { setMenuOpen(false); window.location.hash = "#/shop"; }}>
            <ShoppingBag size={14} /> Full Shop
          </button>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8 }} onClick={() => { setMenuOpen(false); window.location.hash = "#/admin"; }}>
            <Lock size={14} /> Admin Panel
          </button>
          <button className="wp-nav-cta" onClick={() => goTo("track")}>
            Get the app
          </button>
        </div>
      )}

      <HeroSection
        trackingValue={trackingValue}
        setTrackingValue={setTrackingValue}
        hintHidden={hintHidden}
        setHintHidden={setHintHidden}
        vehicle={vehicle}
        setVehicle={setVehicle}
        parallaxRef={parallaxRef}
      />
      <TrackSection />
      <PaySection payMethod={payMethod} setPayMethod={setPayMethod} />
      <PricingSection
        basePrice={basePrice}
        setBasePrice={setBasePrice}
        distanceKm={distanceKm}
        setDistanceKm={setDistanceKm}
        ratePerKm={ratePerKm}
        setRatePerKm={setRatePerKm}
        feePercent={feePercent}
        setFeePercent={setFeePercent}
        taxPercent={taxPercent}
        setTaxPercent={setTaxPercent}
      />
      <ProductFormSection
        productCategory={productCategory}
        setProductCategory={setProductCategory}
        productPrice={productPrice}
        setProductPrice={setProductPrice}
        productModel={productModel}
        setProductModel={setProductModel}
        productPhone={productPhone}
        setProductPhone={setProductPhone}
        productBrand={productBrand}
        setProductBrand={setProductBrand}
        productQuality={productQuality}
        setProductQuality={setProductQuality}
        productRequests={productRequests}
        submitProductRequest={submitProductRequest}
      />
      <BanksSection bankAmount={bankAmount} setBankAmount={setBankAmount} />
      <DonateSection
        bankAmount={bankAmount}
        setBankAmount={setBankAmount}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        donationMethod={donationMethod}
        setDonationMethod={setDonationMethod}
        docUnlocked={docUnlocked}
        setDocUnlocked={setDocUnlocked}
      />
      <FeedbackSection
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        feedbackItems={feedbackItems}
        setFeedbackItems={setFeedbackItems}
        addFeedbackFiles={addFeedbackFiles}
      />
      <ContactSection />
      <ProductsShowcase onSeeAll={() => (window.location.hash = "#/shop")} />
      <FeaturesSection />
      <footer className="wp-footer wp-reveal">
        <div className="wp-footer-brand"><b>Waypoint</b> — delivery you can see coming.</div>
        <div className="wp-socials">
          <a className="wp-social-btn wp-social-tg" href="https://t.me/waypointdelivery" target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram">
            <Send size={18} strokeWidth={2} />
          </a>
          <a className="wp-social-btn wp-social-tt" href="https://www.tiktok.com/@waypointdelivery" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok">
            <Music2 size={18} strokeWidth={2} />
          </a>
          <a className="wp-social-btn wp-social-fb" href="https://facebook.com/waypointdelivery" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
            <Facebook size={18} strokeWidth={2} />
          </a>
        </div>
        <div className="wp-footer-brand">© 2026 Waypoint Logistics</div>
      </footer>
    </div>
  );
}

export default HomePage;
