const STORAGE_KEY = "waypoint.products.v1";
const AUTH_KEY = "waypoint.admin.auth.v1";
const DEFAULT_PASSWORD = "admin123";

const CATEGORIES = [
  { id: "perfume", label: "Perfumes", icon: "Spray" },
  { id: "router", label: "Wi-Fi Routers", icon: "Wifi" },
  { id: "watch", label: "Watches", icon: "Watch" },
];

function seedProducts() {
  return [
    {
      id: "p-" + Math.random().toString(36).slice(2, 9),
      category: "perfume",
      brand: "Aurora Scents",
      model: "Noir Éternel EDP 100ml",
      quality: "Premium · 96% longevity · 9.2/10",
      price: 129,
      currency: "USD",
      phone: "+1 (555) 012-8410",
      description:
        "Oud-vanilla top with a sandalwood dry-down. Unisex, 12+ hour projection.",
      image: "",
      createdAt: Date.now(),
    },
    {
      id: "p-" + Math.random().toString(36).slice(2, 9),
      category: "router",
      brand: "NexusNet",
      model: "NX-7800 Tri-Band Wi-Fi 7",
      quality: "Flagship · BE15000 · 10GbE WAN",
      price: 449,
      currency: "USD",
      phone: "+1 (555) 010-7722",
      description:
        "6 GHz band, 4x4 MIMO, coverage up to 4,200 sq ft, mesh ready.",
      image: "",
      createdAt: Date.now() + 1,
    },
    {
      id: "p-" + Math.random().toString(36).slice(2, 9),
      category: "watch",
      brand: "Chronos & Co.",
      model: "Aviator GMT 42mm Automatic",
      quality: "Swiss Made · Sellita SW330 · Sapphire",
      price: 1780,
      currency: "USD",
      phone: "+1 (555) 011-3399",
      description:
        "GMT complication, 200m water resistance, exhibition caseback, 72h power reserve.",
      image: "",
      createdAt: Date.now() + 2,
    },
  ];
}

function loadProducts() {
  if (typeof window === "undefined") return seedProducts();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedProducts();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedProducts();
    return parsed;
  } catch (err) {
    console.warn("[products] load failed", err);
    return seedProducts();
  }
}

function saveProducts(products) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn("[products] save failed", err);
  }
}

function formatPrice(p, currency) {
  const cur = currency || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(Number(p) || 0);
  } catch {
    return `${cur} ${Number(p) || 0}`;
  }
}

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

function isAdminAuthed() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

function setAdminAuthed(value) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage.setItem(AUTH_KEY, "1");
    else window.sessionStorage.removeItem(AUTH_KEY);
  } catch {}
}

function checkAdminPassword(input) {
  return String(input || "") === DEFAULT_PASSWORD;
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export {
  CATEGORIES,
  DEFAULT_PASSWORD,
  loadProducts,
  saveProducts,
  formatPrice,
  getCategory,
  isAdminAuthed,
  setAdminAuthed,
  checkAdminPassword,
  fileToDataURL,
};
