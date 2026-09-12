import React, { useCallback, useEffect, useState } from "react";
import AdminPage from "./AdminPage.jsx";
import ShopPage from "./ShopPage.jsx";
import HomePage from "./home/HomePage.jsx";

function Router() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#\/?/, "") || "");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#\/?/, "") || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((name) => {
    if (name === "home") {
      window.location.hash = "";
      setRoute("");
    } else if (name === "shop") {
      window.location.hash = "#/shop";
      setRoute("shop");
    } else if (name === "admin") {
      window.location.hash = "#/admin";
      setRoute("admin");
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (route === "shop") return <ShopPage onNav={navigate} />;
  if (route === "admin") return <AdminPage onNav={navigate} />;
  return <HomePage />;
}

export default Router;
