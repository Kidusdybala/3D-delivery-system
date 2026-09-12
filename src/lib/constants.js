import {
  Route,
  Clock3,
  PackageCheck,
  Bike,
  Banknote,
  Smartphone,
  Landmark,
  Wallet,
  Sparkles,
  Wifi,
  Watch,
} from "lucide-react";

const WAYPOINTS = [
  [-12, 2.2],
  [-6.5, -2.2],
  [-1, 2.6],
  [4.5, -1.8],
  [9.5, 2.0],
  [13, 0],
];

const STEPS = [
  { label: "Order confirmed", time: "14:02", place: "Bole", status: "done" },
  { label: "Picked up by rider", time: "14:14", place: "Bole", status: "done" },
  { label: "On the way", time: "14:20", place: "Cameroon Street", status: "current" },
  { label: "Arriving soon", time: "Est. 14:31", place: "Kazanchis", status: "pending" },
  { label: "Delivered", time: "Est. 14:38", place: "Kazanchis", status: "pending" },
];

const FEATURES = [
  {
    icon: Route,
    title: "See the actual street",
    body: "Every delivery renders as a real route through the city, not a dot on a flat map — so you know exactly where the rider or driver is right now.",
  },
  {
    icon: Clock3,
    title: "Windows that hold",
    body: "Estimates update from live position and city traffic, not a static average, so the window you're given is the window you get.",
  },
  {
    icon: PackageCheck,
    title: "Proof at the door",
    body: "Photo and signature capture attach straight to the order, so a delivered status always comes with the evidence.",
  },
  {
    icon: Bike,
    title: "Riders and drivers, not a black box",
    body: "Dispatchers see every bike and car's position in one view, and can re-route someone mid-run in two taps.",
  },
];

const PRODUCT_CATEGORIES = [
  { id: "perfumes", label: "Perfumes", icon: Sparkles },
  { id: "wifi_router", label: "Wi‑Fi Router", icon: Wifi },
  { id: "watches", label: "Watches", icon: Watch },
];

const QUALITY_OPTIONS = [
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
  { id: "original", label: "Original" },
];

const ETHIOPIA_BANKS = [
  { id: "cbe", name: "Commercial Bank of Ethiopia (CBE)", hint: "CBE" },
  { id: "awash", name: "Awash Bank", hint: "Awash" },
  { id: "dashen", name: "Dashen Bank", hint: "Dashen" },
  { id: "abyssinia", name: "Bank of Abyssinia", hint: "Abyssinia" },
  { id: "wegagen", name: "Wegagen Bank", hint: "Wegagen" },
  { id: "hibret", name: "Hibret Bank", hint: "Hibret" },
  { id: "bunna", name: "Bunna Bank", hint: "Bunna" },
  { id: "coop", name: "Cooperative Bank of Oromia", hint: "Coop" },
  { id: "oromia", name: "Oromia Bank", hint: "Oromia" },
  { id: "lion", name: "Lion International Bank", hint: "Lion" },
  { id: "zemen", name: "Zemen Bank", hint: "Zemen" },
  { id: "berhan", name: "Berhan Bank", hint: "Berhan" },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on delivery", hint: "Pay the courier directly", icon: Banknote },
  { id: "telebirr", label: "Telebirr", hint: "Scan with the Telebirr app", icon: Smartphone },
  { id: "cbebirr", label: "CBE Birr", hint: "Scan with CBE Birr mobile", icon: Landmark },
  { id: "hellocash", label: "HelloCash", hint: "Scan with your HelloCash wallet", icon: Wallet },
];

const BRANDS = {
  telebirr: { bg: "#5FBF3F", fg: "#0d2b0a", mark: "telebirr" },
  cbebirr: { bg: "#5B2A86", fg: "#F4C531", mark: "CBE Birr" },
  hellocash: { bg: "#EF6C1A", fg: "#ffffff", mark: "HelloCash" },
};

export {
  WAYPOINTS,
  STEPS,
  FEATURES,
  PRODUCT_CATEGORIES,
  QUALITY_OPTIONS,
  ETHIOPIA_BANKS,
  PAYMENT_METHODS,
  BRANDS,
};
