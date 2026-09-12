import React, { useCallback, useEffect, useState } from "react";
import AdminPage from "./AdminPage.jsx";
import AdminLoginPage from "./AdminLoginPage.jsx";
import ShopPage from "./ShopPage.jsx";
import HomePage from "./home/HomePage.jsx";
import { isAdminAuthed } from "./products.js";

function parseRoute(raw) {
  const cleaned = (raw || "").replace(/^#\/?/, "");
  if (!cleaned) return { name: "home" };
  if (cleaned === "shop") return { name: "shop" };
  if (cleaned === "admin") return { name: "admin" };
  if (cleaned === "admin/login") return { name: "admin-login" };
  return { name: "home" };
}

function Router() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((name) => {
    const map = {
      home: "",
      shop: "#/shop",
      admin: "#/admin",
      "admin-login": "#/admin/login",
    };
    if (map[name] !== undefined) {
      window.location.hash = map[name];
      setRoute({ name });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  if (route.name === "shop") return <ShopPage onNav={navigate} />;
  if (route.name === "admin-login") return <AdminLoginPage onNav={navigate} />;
  if (route.name === "admin") {
    if (!isAdminAuthed()) {
      return <AdminLoginPage onNav={navigate} />;
    }
    return <AdminPage onNav={navigate} />;
  }
  return <HomePage />;
}

export default Router;
