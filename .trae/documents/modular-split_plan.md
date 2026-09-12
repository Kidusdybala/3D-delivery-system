# Modular Split Implementation Plan

## Repository Research

Current state:
- **Root file**: `waypoint-delivery.jsx` — **2,732 lines** (one monolithic file containing Three.js 3D scene, 10+ home page sections, forms, UI primitives, routing, CSS-in-JS)
- **`src/` folder** already exists with:
  - `products.js` (147 lines) — product storage / categories / admin auth ✅ already separate
  - `AdminPage.jsx` (505 lines) — admin CRUD ✅ already separate
  - `ShopPage.jsx` (185 lines) — shop page + `ProductsShowcase` ✅ already separate
  - `main.jsx` (9 lines) — React entry ✅ already separate

Monolith structure (by line numbers in `waypoint-delivery.jsx`):
- Lines 40–700: 3D Three.js scene (`WAYPOINTS`, `buildRoad`, `buildBuildings`, `mulberry32`, `disposeGroup`, `sharedMaterials`, `buildCar`, `buildBike`, `buildVehicle`, `DeliveryScene` component)
- Lines 707–745: `TiltCard` primitive
- Lines 751–912: Payment module (`PAYMENT_METHODS`, `BRANDS`, `BrandBadge`, `formatETB`, `hashStr`, `inFinderZone`, `QrPattern`, `ScannerPanel`, `CashPanel`)
- Lines 914–1005: Static data + utilities (`STEPS`, `FEATURES`, `PRODUCT_CATEGORIES`, `QUALITY_OPTIONS`, `ETHIOPIA_BANKS`, `safeNum`, `clamp`, `Field`, `BankQr`)
- Lines 1007–2891: **`HomePage` component** (~1,885 lines) — 10 sections + nav + footer + all state + all CSS
- Lines 2893–2931: `Router` component + default export

Goal: keep import graph simple, single `App` export from `waypoint-delivery.jsx`, no behavior changes.

## Files and Modules (new directory layout)

```
waypoint-delivery.jsx           # thin router re-export only (~30 lines)
src/
├── main.jsx                    # unchanged
├── products.js                 # unchanged
├── AdminPage.jsx               # unchanged
├── ShopPage.jsx                # unchanged
│
├── lib/
│   ├── utils.js                # safeNum, clamp, mulberry32, hashStr, formatETB, inFinderZone
│   └── constants.js            # STEPS, FEATURES, PRODUCT_CATEGORIES, QUALITY_OPTIONS, ETHIOPIA_BANKS, PAYMENT_METHODS, BRANDS, WAYPOINTS
│
├── three/
│   ├── sceneBuilders.js        # buildRoad, buildBuildings, sharedMaterials, disposeGroup, buildCar, buildBike, buildVehicle
│   └── DeliveryScene.jsx       # DeliveryScene React component + useEffect/render loop
│
├── ui/
│   ├── primitives.jsx          # TiltCard, Field, BrandBadge, BankQr, QrPattern
│   └── payment.jsx             # ScannerPanel, CashPanel
│
├── home/
│   ├── HomePage.jsx            # HomePage shell: nav, state, composition, footer, CSS, scroll observers (~350 lines)
│   ├── sections/
│   │   ├── HeroSection.jsx     # wp-hero, 3D canvas, track box (~80 lines JSX)
│   │   ├── TrackSection.jsx    # wp-status / Timeline (STEPS)
│   │   ├── PaySection.jsx      # wp-pay (ScannerPanel/CashPanel selector)
│   │   ├── PricingSection.jsx  # wp-peak pricing dashboard
│   │   ├── ProductFormSection.jsx  # wp-peak product request form
│   │   ├── BanksSection.jsx    # wp-peak banks QR grid
│   │   ├── DonateSection.jsx   # wp-peak donation + document lock
│   │   ├── FeedbackSection.jsx # wp-peak feedback / media / voice-video
│   │   ├── ContactSection.jsx  # wp-peak contact + map placeholder
│   │   └── FeaturesSection.jsx # wp-features FEATURES grid
│   └── home.css.js             # Extracted CSS string (~1,000 lines)
│
└── App.jsx                     # Router component (was at bottom of monolith)
```

Net result: ~2,732-line file becomes ~15 focused modules of 50–350 lines each; `waypoint-delivery.jsx` is a 3-line `export { default } from "./src/App.jsx";`.

## Implementation Steps (dependency order)

1. **Create `src/lib/utils.js`** — move pure utilities: `safeNum`, `clamp`, `mulberry32`, `hashStr`, `formatETB`, `inFinderZone`.
2. **Create `src/lib/constants.js`** — move all static arrays/objects: `WAYPOINTS`, `STEPS`, `FEATURES`, `PRODUCT_CATEGORIES`, `QUALITY_OPTIONS`, `ETHIOPIA_BANKS`, `PAYMENT_METHODS`, `BRANDS`.
3. **Create `src/three/sceneBuilders.js`** — move pure Three.js builders: `buildRoad`, `buildBuildings`, `disposeGroup`, `sharedMaterials`, `buildCar`, `buildBike`, `buildVehicle`. Import THREE.
4. **Create `src/three/DeliveryScene.jsx`** — move `DeliveryScene` React component (effect, camera tuning, pointer/gyro/pinch handlers, raf loop, `buildVehicle` toggle). Imports from `sceneBuilders.js` + `constants.js` (WAYPOINTS).
5. **Create `src/ui/primitives.jsx`** — `TiltCard`, `Field`, `BrandBadge`, `BankQr`, `QrPattern`. Import `hashStr`, `inFinderZone`, `mulberry32` from `lib/utils.js`; BRANDS from `lib/constants.js`.
6. **Create `src/ui/payment.jsx`** — `ScannerPanel`, `CashPanel`. Import primitives + `PAYMENT_METHODS` + `formatETB`.
7. **Create `src/home/home.css.js`** — extract the entire `<style>` string (the ~1,000 line CSS) from HomePage. Export as string.
8. **Create each home section file** (HeroSection → TrackSection → PaySection → PricingSection → ProductFormSection → BanksSection → DonateSection → FeedbackSection → ContactSection → FeaturesSection). Each exports a single component that accepts the state/setters it needs as props (no internal duplication of state; HomePage lifts state).
9. **Create `src/home/HomePage.jsx`** — shell: imports CSS string, owns all lifted state (trackingValue, hintHidden, payMethod, vehicle, menuOpen, activeSection, pricing fields, productCategory/Price/Model/Phone/Brand/Quality/productRequests, bankAmount, donationAmount, donationMethod, docUnlocked, feedbackText/Items, parallaxRef, rootRef). Composes nav, hero, 9 sections, footer, ProductsShowcase. All scroll/parallax/reveal IntersectionObserver effects live here.
10. **Create `src/App.jsx`** — move `Router` component here. Imports `AdminPage`, `ShopPage`, `HomePage` from `src/home/HomePage.jsx`. Hash-change listener + navigate callback unchanged.
11. **Shrink `waypoint-delivery.jsx`** → becomes: `export { default } from "./src/App.jsx";` (so `main.jsx` import path keeps working with **zero changes** to existing entry).
12. **Update `src/ShopPage.jsx` + `src/AdminPage.jsx` + `ProductsShowcase` imports** for any utilities moved to `lib/utils.js` (e.g., if they need formatPrice → stays in products.js, no change).
13. **Validation**: `npm run build` + dev smoke-test. Then run `GetDiagnostics`.

## Dependencies and Considerations

- **State lifting**: Product request form state, pricing sliders, payment method, vehicle toggle, menu open, scroll observers — all stay in `HomePage` and are passed as props to sections. Sections are controlled components. This avoids the "duplicate 10 useState calls" anti-pattern.
- **CSS**: Keep CSS exactly as-is (string literal) — just relocate to `home.css.js` export. No reformatting; no scope changes.
- **`waypoint-delivery.jsx` backward compat**: must re-export `default` from new `src/App.jsx` so `import App from "../waypoint-delivery.jsx"` in `main.jsx` doesn't break (avoid touching `index.html` or vite config).
- **Three.js**: Keep one `import * as THREE from "three"` inside `sceneBuilders.js` + `DeliveryScene.jsx`.
- **Gyro/pointer/touch handlers**: All live inside `DeliveryScene.jsx` (they already do — just move the whole function unchanged).
- **Product showcase**: The `ProductsShowcase` component stays in `src/ShopPage.jsx` and is imported by `HomePage.jsx` (already the case — import path stays `../src/ShopPage.jsx` → becomes `./ShopPage.jsx` inside `src/home/`).
- **Imports already in monolith**: 32 icons from `lucide-react`. Each section imports only the icons it uses (reduces unused imports per module but overall bundle unchanged due to tree-shaking).

## Validation

1. `npm run build` must exit 0 — identical chunk sizes to pre-split (within ±1%).
2. `GetDiagnostics` (VS Code) — no errors across the 15 new files.
3. Manual checks (via dev server if possible, else import graph review):
   - Hash routes `#/shop`, `#/admin`, `""` (home) all render.
   - 3D scene still animates (raf loop imported correctly).
   - Product showcase renders on home (import graph includes ShopPage exports).
   - Pricing dashboard state flows: changing distance updates total in PricingSection.
   - Payment method toggle swaps ScannerPanel/CashPanel.
4. No console warnings about duplicate React keys or missing `useEffect` deps (we copy code verbatim — deps are unchanged).

## Risks

- **Risk: Circular import between App ↔ HomePage ↔ ShopPage.** Handling: `App.jsx` → `HomePage.jsx` → `ShopPage.jsx` (named import `ProductsShowcase` + default `ShopPage`). No cycles.
- **Risk: Lifting state breaks refs (`rootRef`, `parallaxRef`) used by hero/observers.** Handling: Refs declared in HomePage shell, passed via props only where needed (HeroSection receives `parallaxRef`). All effects stay in HomePage where refs live.
- **Risk: Accidentally duplicating the lifted useState calls — each section has its own copy.** Handling: Every state setter used by a section is passed as a prop (e.g., `<PricingSection basePrice setBasePrice distanceKm ... />`). Rule: no `useState` inside any `sections/*.jsx`.
- **Risk: Monolith can't be cleaned up piecemeal because import errors block build.** Handling: Create all 15 files first (empty skeletons with placeholder exports), then cut-paste code sections one module at a time (build after each step 1–3, then after step 11, then final build at step 13). Fallback: `git restore waypoint-delivery.jsx` if the split is unrecoverable.
