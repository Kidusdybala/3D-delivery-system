import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { WAYPOINTS } from "../lib/constants.js";
import {
  buildRoad,
  buildBuildings,
  disposeGroup,
  buildVehicle,
} from "./sceneBuilders.js";

function DeliveryScene({ className, vehicle }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const vehicleRef = useRef({ group: null, marker: null, bobBase: 1 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = typeof window !== "undefined" &&
      (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent || ""));
    const isPortrait = window.innerHeight > window.innerWidth;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0f1a, isMobile && isPortrait ? 8 : 20, isMobile && isPortrait ? 26 : 40);

    const baseFov = isMobile ? (isPortrait ? 62 : 56) : 42;
    const camera = new THREE.PerspectiveCamera(
      baseFov,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      120
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const isSmallScreen = window.innerWidth <= 720;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 2 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isMobile ? 1.55 : 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 60),
      new THREE.MeshStandardMaterial({ color: 0x1c2436, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);

    buildRoad(scene);
    buildBuildings(scene);

    const ambient = new THREE.AmbientLight(0x3a4868, isMobile ? 1.25 : 1.1);
    scene.add(ambient);
    const moon = new THREE.DirectionalLight(0x8fa8ff, isMobile ? 1.0 : 0.9);
    moon.position.set(8, 14, -6);
    scene.add(moon);
    const fill = new THREE.DirectionalLight(0x4a6fa8, isMobile ? 0.55 : 0.4);
    fill.position.set(-8, 6, 8);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc48a, 0.35);
    rim.position.set(-4, 3, -10);
    scene.add(rim);

    sceneRef.current = { scene, camera, renderer };

    const center = new THREE.Vector3(0.5, 0.1, 0.2);
    let angle = 0.9;
    let baseRadius = 14;
    let baseHeight = 7.5;
    let baseFogNear = 20;
    let baseFogFar = 40;
    let mouseAmpX = 1.2;
    let mouseAmpY = 1.2;
    let dragDX = 0.006;
    let dragDY = 0.02;

    function tuneCameraForAspect(aspect) {
      if (aspect < 0.62) {
        baseRadius = 9.5;
        baseHeight = 3.6;
        baseFogNear = 7;
        baseFogFar = 24;
        mouseAmpX = 2.2;
        mouseAmpY = 1.8;
        dragDX = 0.008;
        dragDY = 0.028;
        camera.fov = 62;
      } else if (aspect < 0.85) {
        baseRadius = 12;
        baseHeight = 5.2;
        baseFogNear = 12;
        baseFogFar = 30;
        mouseAmpX = 1.8;
        mouseAmpY = 1.5;
        dragDX = 0.007;
        dragDY = 0.024;
        camera.fov = 56;
      } else if (aspect < 1.15) {
        baseRadius = 16.5;
        baseHeight = 8.5;
        baseFogNear = 18;
        baseFogFar = 36;
        mouseAmpX = 1.4;
        mouseAmpY = 1.3;
        camera.fov = 48;
      } else {
        baseRadius = 14;
        baseHeight = 7.5;
        baseFogNear = 20;
        baseFogFar = 40;
        mouseAmpX = 1.2;
        mouseAmpY = 1.2;
        camera.fov = 42;
      }
      scene.fog.near = baseFogNear;
      scene.fog.far = baseFogFar;
      camera.updateProjectionMatrix();
    }
    tuneCameraForAspect(camera.aspect);

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    function onPointerMove(e) {
      if (dragState.active) return;
      const rect = mount.getBoundingClientRect();
      mouseTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    mount.addEventListener("pointermove", onPointerMove);

    const dragState = { active: false, lastX: 0, lastY: 0 };
    let dragAngleOffset = 0;
    let dragHeightOffset = 0;
    mount.style.touchAction = "none";

    function onPointerDown(e) {
      if (isMobile && typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((p) => { if (p === "granted") enableOrientation(); })
          .catch(() => {});
      }
      dragState.active = true;
      dragState.lastX = e.clientX;
      dragState.lastY = e.clientY;
      try { mount.setPointerCapture(e.pointerId); } catch (err) {}
      mount.classList.add("wp-dragging");
    }
    function onDragMove(e) {
      if (!dragState.active) return;
      const dx = e.clientX - dragState.lastX;
      const dy = e.clientY - dragState.lastY;
      dragAngleOffset -= dx * dragDX;
      dragHeightOffset = Math.max(-4, Math.min(6, dragHeightOffset + dy * dragDY));
      dragState.lastX = e.clientX;
      dragState.lastY = e.clientY;
    }
    function onPointerUp(e) {
      dragState.active = false;
      mount.classList.remove("wp-dragging");
      try { mount.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onDragMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);

    let gyroAlphaOffset = null;
    let gyroBetaCenter = null;
    let gyroGammaCenter = null;
    let gyroAngleOffset = 0;
    let gyroHeightOffset = 0;
    let gyroPanX = 0;
    let gyroPanY = 0;

    function onOrientation(e) {
      if (e.alpha == null) return;
      if (gyroAlphaOffset == null) {
        gyroAlphaOffset = e.alpha;
        gyroBetaCenter = e.beta;
        gyroGammaCenter = e.gamma;
      }
      let dGamma = (e.gamma - gyroGammaCenter) || 0;
      let dBeta = (e.beta - gyroBetaCenter) || 0;
      dGamma = Math.max(-30, Math.min(30, dGamma));
      dBeta = Math.max(-25, Math.min(25, dBeta));
      const smooth = 0.12;
      gyroAngleOffset += (-dGamma * 0.012 - gyroAngleOffset) * smooth;
      gyroHeightOffset += (-dBeta * 0.015 - gyroHeightOffset) * smooth;
      gyroPanX += (-dGamma * 0.08 - gyroPanX) * smooth;
      gyroPanY += (-dBeta * 0.06 - gyroPanY) * smooth;
    }
    function enableOrientation() {
      window.addEventListener("deviceorientation", onOrientation, false);
    }
    if (isMobile && typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission !== "function") {
      enableOrientation();
    }

    let lastTouchDist = 0;
    let pinchZoomOffset = 0;

    function onTouchStart(e) {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }
    function onTouchMove(e) {
      if (e.touches.length === 2 && lastTouchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = (dist - lastTouchDist) * 0.02;
        pinchZoomOffset = Math.max(-3, Math.min(4, pinchZoomOffset + delta));
        lastTouchDist = dist;
      }
    }
    function onTouchEnd() { lastTouchDist = 0; }
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onTouchEnd, { passive: true });

    let raf;
    let t = 0;
    const clock = new THREE.Clock();

    function frame() {
      const dt = Math.min(clock.getDelta(), 0.05);

      if (!reduceMotion) {
        t += dt * 0.045;
        if (!dragState.active) angle += dt * 0.02;
      }

      mouse.x += (mouseTarget.x - mouse.x) * 0.04;
      mouse.y += (mouseTarget.y - mouse.y) * 0.04;

      const heroEl = mount.closest(".wp-hero");
      const heroH = heroEl ? heroEl.offsetHeight : 1;
      const scrollProgress = Math.max(0, Math.min(1, window.scrollY / heroH));
      const mobileScrollDamp = isMobile ? 0.35 : 1;
      const radius = baseRadius + scrollProgress * 7 * mobileScrollDamp + pinchZoomOffset;
      const camHeight = baseHeight + scrollProgress * 5 * mobileScrollDamp + dragHeightOffset + gyroHeightOffset;

      const cycle = (t % 2 <= 1 ? t % 2 : 2 - (t % 2));
      const segments = WAYPOINTS.length - 1;
      const scaled = cycle * segments;
      let idx = Math.floor(scaled);
      idx = Math.max(0, Math.min(segments - 1, idx));
      const localT = scaled - idx;
      const [x1, z1] = WAYPOINTS[idx];
      const [x2, z2] = WAYPOINTS[idx + 1];
      const forward = t % 2 <= 1;
      const px = x1 + (x2 - x1) * localT;
      const pz = z1 + (z2 - z1) * localT;
      const dx = x2 - x1;
      const dz = z2 - z1;
      let heading = Math.atan2(-dz, dx);
      if (!forward) heading += Math.PI;

      const rig = vehicleRef.current;
      if (rig.group) {
        rig.group.position.set(px, 0, pz);
        rig.group.rotation.y = heading;
      }
      if (rig.marker) {
        rig.marker.position.y = rig.bobBase + Math.sin(t * 6) * 0.05;
      }

      const viewAngle = angle + dragAngleOffset + gyroAngleOffset;
      camera.position.x =
        center.x + Math.cos(viewAngle) * radius +
        mouse.x * mouseAmpX + gyroPanX;
      camera.position.z =
        center.z + Math.sin(viewAngle) * radius +
        mouse.y * (mouseAmpY * 0.6);
      camera.position.y =
        camHeight - mouse.y * mouseAmpY + gyroPanY;

      const lookShift = new THREE.Vector3(gyroPanX * 0.4, gyroPanY * 0.3, 0);
      const lookTarget = center.clone().add(lookShift);
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    frame();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      tuneCameraForAspect(camera.aspect);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onDragMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("deviceorientation", onOrientation, false);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const rig = sceneRef.current;
    if (!rig) return;
    if (vehicleRef.current.group) {
      rig.scene.remove(vehicleRef.current.group);
      disposeGroup(vehicleRef.current.group);
    }
    const built = buildVehicle(vehicle);
    rig.scene.add(built.group);
    vehicleRef.current = built;
  }, [vehicle]);

  return <div ref={mountRef} className={className} />;
}

export default DeliveryScene;
