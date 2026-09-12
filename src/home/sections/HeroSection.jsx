import React from "react";
import { Bike, Car } from "lucide-react";
import DeliveryScene from "../../three/DeliveryScene.jsx";

function HeroSection({ trackingValue, setTrackingValue, hintHidden, setHintHidden, vehicle, setVehicle, parallaxRef }) {
  return (
    <section className="wp-hero" onPointerDown={() => setHintHidden(true)}>
      <div className="wp-hero-canvas-wrap" ref={parallaxRef}>
        <DeliveryScene className="wp-hero-canvas" vehicle={vehicle} />
      </div>
      <div className="wp-hero-fade" />
      <div className={`wp-hero-hint ${hintHidden ? "wp-hidden" : ""}`}>
        tilt · swipe · pinch · drag to look around
      </div>
      <div className="wp-vehicle-toggle" onPointerDown={(e) => e.stopPropagation()}>
        <button
          className={vehicle === "bike" ? "active" : ""}
          onClick={() => setVehicle("bike")}
        >
          <Bike size={15} strokeWidth={2} /> Bike
        </button>
        <button
          className={vehicle === "car" ? "active" : ""}
          onClick={() => setVehicle("car")}
        >
          <Car size={15} strokeWidth={2} /> Car
        </button>
      </div>
      <div className="wp-hero-content">
        <div>
          <h1>Track it like you're riding along.</h1>
          <p className="wp-hero-sub">
            Waypoint renders every local delivery as an actual route through the city —
            the street, the rider or driver, the distance left — instead of a dot
            inching across a flat map.
          </p>
        </div>
        <div className="wp-track-box">
          <div className="wp-track-label">Order code</div>
          <div className="wp-track-input-row">
            <input
              type="text"
              placeholder="WP-2291"
              value={trackingValue}
              onChange={(e) => setTrackingValue(e.target.value)}
            />
            <button type="button">Track delivery</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
