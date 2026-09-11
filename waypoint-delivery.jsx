import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  Route,
  Clock3,
  PackageCheck,
  Banknote,
  Smartphone,
  Landmark,
  Wallet,
  CheckCircle2,
  Menu,
  X,
  Bike,
  Car,
  Calculator,
  Percent,
  Sparkles,
  Wifi,
  Watch,
  QrCode,
  HeartHandshake,
  FileText,
  MessageSquare,
  Mic,
  Video,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  3D hero: a low-poly delivery van driving a winding road at dusk    */
/* ------------------------------------------------------------------ */

const WAYPOINTS = [
  [-12, 2.2],
  [-6.5, -2.2],
  [-1, 2.6],
  [4.5, -1.8],
  [9.5, 2.0],
  [13, 0],
];

function buildRoad(scene) {
  const roadWidth = 3;
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x141a29,
    roughness: 1,
    metalness: 0,
  });
  const stripeMat = new THREE.MeshBasicMaterial({
    color: 0xff9a44,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const [x1, z1] = WAYPOINTS[i];
    const [x2, z2] = WAYPOINTS[i + 1];
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(-dz, dx);
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;

    const seg = new THREE.Mesh(
      new THREE.PlaneGeometry(len + 1.4, roadWidth),
      roadMat
    );
    seg.rotation.x = -Math.PI / 2;
    seg.rotation.z = angle;
    seg.position.set(midX, 0.01 + i * 0.0005, midZ);
    scene.add(seg);

    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(len + 1.4, 0.18),
      stripeMat
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.rotation.z = angle;
    stripe.position.set(midX, 0.03 + i * 0.0005, midZ);
    scene.add(stripe);
  }
}

function buildBuildings(scene) {
  const colors = [0x3a4a68, 0x445374, 0x2e3a54, 0x4a5a7a];
  const rnd = mulberry32(7);
  for (let i = 0; i < 22; i++) {
    const segIndex = Math.floor(rnd() * (WAYPOINTS.length - 1));
    const [x1, z1] = WAYPOINTS[segIndex];
    const [x2, z2] = WAYPOINTS[segIndex + 1];
    const t = rnd();
    const bx = x1 + (x2 - x1) * t;
    const bz = z1 + (z2 - z1) * t;
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const px = -dz / len;
    const pz = dx / len;
    const side = rnd() > 0.5 ? 1 : -1;
    const dist = 3 + rnd() * 6;

    const h = 1.2 + rnd() * 4.5;
    const w = 0.9 + rnd() * 1.6;
    const d = 0.9 + rnd() * 1.6;

    const mat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.9,
      emissive: 0x3a4468,
      emissiveIntensity: 0.3 + rnd() * 0.25,
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    box.position.set(
      bx + px * dist * side,
      h / 2,
      bz + pz * dist * side
    );
    box.rotation.y = rnd() * Math.PI;
    scene.add(box);
  }
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function disposeGroup(group) {
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
}

function sharedMaterials() {
  return {
    bodyMat: new THREE.MeshStandardMaterial({ color: 0xe9ecf4, roughness: 0.55, metalness: 0.15 }),
    darkMat: new THREE.MeshStandardMaterial({ color: 0x0e131f, roughness: 0.8 }),
    mintMat: new THREE.MeshStandardMaterial({
      color: 0x4fe0a8,
      emissive: 0x1c6b4d,
      emissiveIntensity: 0.6,
      roughness: 0.4,
    }),
    glassMat: new THREE.MeshStandardMaterial({ color: 0x2a3550, emissive: 0x3a4a7a, emissiveIntensity: 0.4 }),
    lightMat: new THREE.MeshStandardMaterial({ color: 0xffb066, emissive: 0xff9a44, emissiveIntensity: 2 }),
    vestMat: new THREE.MeshStandardMaterial({ color: 0xff9a44, roughness: 0.6 }),
    skinMat: new THREE.MeshStandardMaterial({ color: 0x8a5a3d, roughness: 0.7 }),
  };
}

function buildCar() {
  const group = new THREE.Group();
  const { bodyMat, darkMat, mintMat, glassMat, lightMat } = sharedMaterials();

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.55, 1.0), bodyMat);
  body.position.set(0, 0.5, 0);
  group.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.4, 0.92), glassMat);
  cabin.position.set(-0.05, 0.86, 0);
  group.add(cabin);

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.14, 0.88), darkMat);
  chassis.position.set(0, 0.2, 0);
  group.add(chassis);

  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 14);
  [
    [0.62, 0.24, 0.5],
    [0.62, 0.24, -0.5],
    [-0.62, 0.24, 0.5],
    [-0.62, 0.24, -0.5],
  ].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, darkMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, y, z);
    group.add(wheel);
  });

  const headGeo = new THREE.SphereGeometry(0.055, 10, 10);
  [0.32, -0.32].forEach((zOff) => {
    const light = new THREE.Mesh(headGeo, lightMat);
    light.position.set(0.86, 0.5, zOff);
    group.add(light);
  });

  // delivery box mounted on the roof
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 0.62), mintMat);
  box.position.set(-0.1, 1.15, 0);
  group.add(box);

  const marker = box;

  const headlight = new THREE.PointLight(0xffb066, 1.3, 8, 2);
  headlight.position.set(1.0, 0.5, 0);
  group.add(headlight);

  // forward-facing torch/spotlight — bright, well-defined yellow beam
  const torch = new THREE.SpotLight(0xffd23f, 6, 16, Math.PI / 9, 0.25, 1.4);
  torch.position.set(0.95, 0.55, 0);
  const torchTarget = new THREE.Object3D();
  torchTarget.position.set(6, -0.1, 0);
  group.add(torch);
  group.add(torchTarget);
  torch.target = torchTarget;

  // visible cone geometry so the beam itself reads clearly, not just its light contribution
  const beamGeo = new THREE.ConeGeometry(0.9, 6, 24, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffd23f,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(0.95 + 3, 0.5, 0);
  group.add(beam);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe58a })
  );
  bulb.position.set(0.98, 0.55, 0);
  group.add(bulb);

  return { group, marker, bobBase: 1.15 };
}

function buildBike() {
  const group = new THREE.Group();
  const { darkMat, mintMat, vestMat, skinMat } = sharedMaterials();

  const wheelGeo = new THREE.TorusGeometry(0.34, 0.045, 8, 20);
  const frontWheel = new THREE.Mesh(wheelGeo, darkMat);
  frontWheel.position.set(0.55, 0.34, 0);
  group.add(frontWheel);
  const rearWheel = new THREE.Mesh(wheelGeo, darkMat);
  rearWheel.position.set(-0.55, 0.34, 0);
  group.add(rearWheel);

  // frame — a few simple beams standing in for the triangle
  const frameMat = darkMat;
  const lowerBeam = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.05, 0.05), frameMat);
  lowerBeam.position.set(0, 0.4, 0);
  lowerBeam.rotation.z = 0.12;
  group.add(lowerBeam);

  const seatPost = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), frameMat);
  seatPost.position.set(-0.32, 0.62, 0);
  seatPost.rotation.z = -0.15;
  group.add(seatPost);

  const forkPost = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), frameMat);
  forkPost.position.set(0.55, 0.58, 0);
  forkPost.rotation.z = -0.08;
  group.add(forkPost);

  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.045, 0.045), frameMat);
  topBeam.position.set(0.08, 0.78, 0);
  topBeam.rotation.z = 0.06;
  group.add(topBeam);

  const handlebar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.42), frameMat);
  handlebar.position.set(0.58, 0.9, 0);
  group.add(handlebar);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), darkMat);
  seat.position.set(-0.34, 0.85, 0);
  group.add(seat);

  // rear rack + delivery box
  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.24), frameMat);
  rack.position.set(-0.55, 0.66, 0);
  group.add(rack);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.28), mintMat);
  box.position.set(-0.55, 0.83, 0);
  group.add(box);

  // rider — simplified torso + head, leaning forward
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.5, 10), vestMat);
  torso.position.set(-0.18, 1.18, 0);
  torso.rotation.z = -0.32;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), skinMat);
  head.position.set(0.02, 1.46, 0);
  group.add(head);

  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.125, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.62),
    darkMat
  );
  helmet.position.set(0.02, 1.48, 0);
  group.add(helmet);

  const marker = box;

  const glow = new THREE.PointLight(0xffb066, 0.9, 6, 2);
  glow.position.set(0.55, 0.9, 0);
  group.add(glow);

  // forward-facing torch/spotlight — bright, well-defined yellow beam
  const torch = new THREE.SpotLight(0xffd23f, 5, 14, Math.PI / 9, 0.25, 1.4);
  torch.position.set(0.6, 0.85, 0);
  const torchTarget = new THREE.Object3D();
  torchTarget.position.set(6, 0.3, 0);
  group.add(torch);
  group.add(torchTarget);
  torch.target = torchTarget;

  // visible cone geometry so the beam itself reads clearly, not just its light contribution
  const beamGeo = new THREE.ConeGeometry(0.75, 5, 24, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffd23f,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(0.6 + 2.5, 0.85, 0);
  group.add(beam);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe58a })
  );
  bulb.position.set(0.62, 0.85, 0);
  group.add(bulb);

  return { group, marker, bobBase: 0.83 };
}

function buildVehicle(type) {
  return type === "car" ? buildCar() : buildBike();
}

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

  // swap the 3D model whenever the chosen vehicle changes (including first mount)
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

/* ------------------------------------------------------------------ */
/*  Tilt card: pointer-driven 3D perspective tilt (mouse + touch)      */
/* ------------------------------------------------------------------ */

function TiltCard({ children, className, style }) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 7;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 7;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  }
  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    el.style.touchAction = "";
  }
  function handleDown() {
    const el = ref.current;
    if (el) el.style.touchAction = "none";
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleLeave}
      onPointerCancel={handleLeave}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pay on delivery — cash + local mobile-money scan-to-pay             */
/* ------------------------------------------------------------------ */

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on delivery", hint: "Pay the courier directly", icon: Banknote },
  { id: "telebirr", label: "Telebirr", hint: "Scan with the Telebirr app", icon: Smartphone },
  { id: "cbebirr", label: "CBE Birr", hint: "Scan with CBE Birr mobile", icon: Landmark },
  { id: "hellocash", label: "HelloCash", hint: "Scan with your HelloCash wallet", icon: Wallet },
];

// Brand colors verified against each provider's real identity —
// telebirr's lime green, CBE's purple-and-gold, HelloCash/BelCash's orange.
// These are stylized wordmark badges built from those colors, not the
// providers' actual logo artwork.
const BRANDS = {
  telebirr: { bg: "#5FBF3F", fg: "#0d2b0a", mark: "telebirr" },
  cbebirr: { bg: "#5B2A86", fg: "#F4C531", mark: "CBE Birr" },
  hellocash: { bg: "#EF6C1A", fg: "#ffffff", mark: "HelloCash" },
};

function BrandBadge({ id, size = "sm" }) {
  const b = BRANDS[id];
  if (!b) return null;
  return (
    <span
      className={`wp-brand-badge wp-brand-${size}`}
      style={{ background: b.bg, color: b.fg }}
    >
      {b.mark}
    </span>
  );
}

function formatETB(n) {
  return `ETB ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function inFinderZone(col, row, size) {
  const zones = [
    [0, 0], [size - 7, 0], [0, size - 7],
  ];
  return zones.some(([zx, zy]) => col >= zx && col < zx + 8 && row >= zy && row < zy + 8);
}

function QrPattern({ seed }) {
  const size = 21;
  const cell = 100 / size;
  const rnd = mulberry32(Math.abs(hashStr(seed)) || 1);
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (inFinderZone(col, row, size)) continue;
      if (rnd() > 0.56) cells.push([col, row]);
    }
  }
  const finders = [[0, 0], [size - 7, 0], [0, size - 7]];

  return (
    <svg viewBox="0 0 100 100" className="wp-qr">
      <rect x="0" y="0" width="100" height="100" fill="#eef1f8" />
      {cells.map(([c, r]) => (
        <rect key={`${c}-${r}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#141a29" />
      ))}
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx * cell} y={fy * cell} width={cell * 7} height={cell * 7} fill="#141a29" />
          <rect x={(fx + 1) * cell} y={(fy + 1) * cell} width={cell * 5} height={cell * 5} fill="#eef1f8" />
          <rect x={(fx + 2) * cell} y={(fy + 2) * cell} width={cell * 3} height={cell * 3} fill="#141a29" />
        </g>
      ))}
    </svg>
  );
}

function ScannerPanel({ method, waybill, amount }) {
  const [scanState, setScanState] = useState("idle");
  const timeoutRef = useRef(null);

  useEffect(() => {
    setScanState("idle");
    return () => clearTimeout(timeoutRef.current);
  }, [method]);

  function simulateScan() {
    setScanState("scanning");
    timeoutRef.current = setTimeout(() => setScanState("success"), 1200);
  }

  const methodLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label;

  return (
    <div className="wp-scan-area">
      <BrandBadge id={method} size="lg" />
      <div className={`wp-scanner ${scanState}`}>
        <div className="wp-qr-wrap" style={{ opacity: scanState === "success" ? 0.15 : 1 }}>
          <QrPattern seed={`${waybill}-${method}`} />
        </div>
        <div className="wp-scan-line" />
        <svg className="wp-scan-brackets" viewBox="0 0 100 100">
          <path d="M6,20 L6,6 L20,6" />
          <path d="M80,6 L94,6 L94,20" />
          <path d="M94,80 L94,94 L80,94" />
          <path d="M20,94 L6,94 L6,80" />
        </svg>
        {scanState === "success" && (
          <div className="wp-scan-success">
            <CheckCircle2 size={40} strokeWidth={1.6} />
          </div>
        )}
      </div>
      <div className="wp-scan-status">
        {scanState === "idle" && `Ask the customer to open ${methodLabel} and scan`}
        {scanState === "scanning" && "Scanning…"}
        {scanState === "success" && `Payment confirmed via ${methodLabel}`}
      </div>
      {scanState !== "success" ? (
        <button
          type="button"
          className="wp-scan-btn"
          onClick={simulateScan}
          disabled={scanState === "scanning"}
        >
          {scanState === "scanning" ? "Scanning…" : "Simulate scan"}
        </button>
      ) : (
        <button type="button" className="wp-scan-btn ghost" onClick={() => setScanState("idle")}>
          Scan another
        </button>
      )}
      <div className="wp-scan-note">Preview only — no real transaction is processed.</div>
    </div>
  );
}

function CashPanel({ amount }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="wp-scan-area">
      <div className={`wp-cash-badge ${confirmed ? "done" : ""}`}>
        {confirmed ? <CheckCircle2 size={40} strokeWidth={1.6} /> : <Banknote size={40} strokeWidth={1.4} />}
      </div>
      <div className="wp-scan-status">
        {confirmed ? `Cash received — ${formatETB(amount)}` : `Collect ${formatETB(amount)} from the customer`}
      </div>
      {!confirmed ? (
        <button type="button" className="wp-scan-btn" onClick={() => setConfirmed(true)}>
          Confirm cash received
        </button>
      ) : (
        <button type="button" className="wp-scan-btn ghost" onClick={() => setConfirmed(false)}>
          Undo
        </button>
      )}
    </div>
  );
}

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

function safeNum(v) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function Field({ label, hint, children }) {
  return (
    <label className="wp-field">
      <span className="wp-field-label">{label}</span>
      {hint ? <span className="wp-field-hint">{hint}</span> : null}
      {children}
    </label>
  );
}

function BankQr({ bankId, seed, alt }) {
  const [broken, setBroken] = useState(false);
  const src = `/bank-qrs/${bankId}.png`;

  if (broken) return <QrPattern seed={seed} />;
  return (
    <img
      className="wp-qr-img"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

export default function App() {
  const [trackingValue, setTrackingValue] = useState("");
  const [hintHidden, setHintHidden] = useState(false);
  const [payMethod, setPayMethod] = useState("telebirr");
  const [vehicle, setVehicle] = useState("bike");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("track");

  // pricing dashboard
  const [basePrice, setBasePrice] = useState(450);
  const [distanceKm, setDistanceKm] = useState(6.8);
  const [ratePerKm, setRatePerKm] = useState(28);
  const [feePercent, setFeePercent] = useState(8);
  const [taxPercent, setTaxPercent] = useState(15);

  // product requests
  const [productCategory, setProductCategory] = useState("perfumes");
  const [productPrice, setProductPrice] = useState("");
  const [productModel, setProductModel] = useState("");
  const [productPhone, setProductPhone] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productQuality, setProductQuality] = useState("premium");
  const [productRequests, setProductRequests] = useState([]);

  // banks + donation + document
  const [bankAmount, setBankAmount] = useState(250);
  const [donationAmount, setDonationAmount] = useState(500);
  const [donationMethod, setDonationMethod] = useState("telebirr");
  const [docUnlocked, setDocUnlocked] = useState(false);

  // feedback
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackItems, setFeedbackItems] = useState([]);

  const rootRef = useRef(null);
  const parallaxRef = useRef(null);

  const pricing = useMemo(() => {
    const base = clamp(safeNum(basePrice), 0, 1_000_000);
    const km = clamp(safeNum(distanceKm), 0, 50_000);
    const rate = clamp(safeNum(ratePerKm), 0, 1_000_000);
    const feePct = clamp(safeNum(feePercent), 0, 100);
    const taxPct = clamp(safeNum(taxPercent), 0, 100);

    const distanceCost = km * rate;
    const sub = base + distanceCost;
    const fee = (sub * feePct) / 100;
    const taxable = sub + fee;
    const tax = (taxable * taxPct) / 100;
    const total = taxable + tax;

    return {
      base,
      km,
      rate,
      feePct,
      taxPct,
      distanceCost,
      sub,
      fee,
      taxable,
      tax,
      total,
    };
  }, [basePrice, distanceKm, ratePerKm, feePercent, taxPercent]);

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

  // highlight the nav link for whichever section is in view
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

  // scroll-linked parallax on the hero visual
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

  // 3D reveal for sections as they scroll into view
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .wp-root {
          --bg: #0b0f1a;
          --panel: #131a29;
          --panel-2: #1b2436;
          --line: rgba(234,237,245,0.09);
          --text: #eaedf5;
          --muted: #8793aa;
          --amber: #ff9a44;
          --mint: #4fe0a8;
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .wp-root * { box-sizing: border-box; max-width: 100%; }
        .wp-root img, .wp-root svg, .wp-root video, .wp-root audio, .wp-root canvas { max-width: 100%; display: block; }
        .wp-root h1, .wp-root h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .wp-mono { font-family: 'IBM Plex Mono', monospace; }

        .wp-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(10px);
          background: rgba(11,15,26,0.6);
        }
        .wp-logo {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: -0.01em;
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 0;
        }
        .wp-logo span { color: var(--amber); }
        .wp-nav-links { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .wp-nav-links button {
          background: none;
          border: none;
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 6px;
        }
        .wp-nav-links button:hover { color: var(--text); }
        .wp-nav-links button.active { color: var(--amber); }
        .wp-nav-cta {
          background: var(--amber);
          color: #241205;
          border: none;
          padding: 10px 18px;
          border-radius: 7px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .wp-nav-cta:hover { filter: brightness(1.08); }
        .wp-nav-toggle {
          display: none;
          background: none;
          border: 1px solid var(--line);
          color: var(--text);
          border-radius: 8px;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .wp-nav-mobile {
          display: none;
          position: sticky;
          top: 61px;
          z-index: 19;
          flex-direction: column;
          gap: 4px;
          padding: 14px 20px 20px;
          background: rgba(11,15,26,0.97);
          border-bottom: 1px solid var(--line);
        }
        .wp-nav-mobile button {
          background: none;
          border: none;
          color: var(--muted);
          text-align: left;
          font-size: 15px;
          padding: 12px 6px;
          border-bottom: 1px solid var(--line);
          cursor: pointer;
        }
        .wp-nav-mobile button.active { color: var(--amber); }
        .wp-nav-mobile .wp-nav-cta {
          margin-top: 12px;
          text-align: center;
          border-bottom: none;
          color: #241205;
        }

        .wp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .wp-hero { min-height: 92vh; }
        }
        .wp-hero-canvas-wrap {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .wp-hero-canvas {
          position: absolute;
          inset: 0;
          cursor: grab;
          touch-action: none;
        }
        .wp-hero-canvas.wp-dragging { cursor: grabbing; }
        .wp-vehicle-toggle {
          position: absolute;
          top: 24px;
          right: 32px;
          z-index: 3;
          display: flex;
          gap: 4px;
          background: rgba(19,26,41,0.6);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 4px;
          backdrop-filter: blur(6px);
        }
        .wp-vehicle-toggle button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 12.5px;
          font-family: 'Inter', sans-serif;
          padding: 7px 12px;
          border-radius: 7px;
          cursor: pointer;
        }
        .wp-vehicle-toggle button.active {
          background: var(--amber);
          color: #241205;
          font-weight: 600;
        }
        .wp-hero-hint {
          position: absolute;
          left: 50%;
          bottom: 190px;
          transform: translateX(-50%);
          z-index: 2;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: var(--muted);
          background: rgba(19,26,41,0.55);
          border: 1px solid var(--line);
          padding: 6px 12px;
          border-radius: 20px;
          pointer-events: none;
          opacity: 0.85;
          transition: opacity 0.4s ease;
        }
        .wp-hero-hint.wp-hidden { opacity: 0; }

        .wp-reveal {
          opacity: 0;
          transform: perspective(900px) rotateX(9deg) translateY(26px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .wp-reveal.wp-in {
          opacity: 1;
          transform: perspective(900px) rotateX(0deg) translateY(0);
        }
        .wp-hero-fade {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 30%, rgba(11,15,26,0) 0%, rgba(11,15,26,0.05) 60%, rgba(11,15,26,0.85) 100%),
            linear-gradient(to bottom, rgba(11,15,26,0) 0%, rgba(11,15,26,0.2) 70%, var(--bg) 100%);
          pointer-events: none;
        }
        .wp-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px 56px;
          display: grid;
          grid-template-columns: 1.2fr 0.9fr;
          gap: 40px;
          align-items: end;
        }
        .wp-hero h1 {
          font-size: clamp(34px, 5vw, 56px);
          line-height: 1.05;
          max-width: 11ch;
        }
        .wp-hero-sub {
          margin-top: 16px;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.55;
          max-width: 46ch;
        }
        .wp-track-box {
          background: rgba(19,26,41,0.72);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 18px 20px;
          backdrop-filter: blur(6px);
        }
        .wp-track-label {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .wp-track-input-row {
          display: flex;
          gap: 10px;
        }
        .wp-track-input-row input {
          flex: 1;
          min-width: 0;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 11px 12px;
          border-radius: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
        }
        .wp-track-input-row input::placeholder { color: #5c6478; }
        .wp-track-input-row input:focus-visible {
          outline: 2px solid var(--amber);
          outline-offset: 1px;
        }
        .wp-track-input-row button {
          background: var(--amber);
          color: #241205;
          border: none;
          padding: 0 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
        }
        .wp-track-input-row button:hover { filter: brightness(1.08); }
        .wp-track-input-row button:focus-visible {
          outline: 2px solid var(--text);
          outline-offset: 2px;
        }

        .wp-status {
          max-width: 1180px;
          margin: 0 auto;
          padding: 64px 32px 20px;
        }
        .wp-status-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
        }
        .wp-route-chip {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          color: var(--mint);
          background: rgba(79,224,168,0.08);
          border: 1px solid rgba(79,224,168,0.25);
          padding: 5px 10px;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        .wp-status-head h2 { font-size: 26px; }
        .wp-eta { text-align: right; }
        .wp-eta-num {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 34px;
          font-weight: 600;
          color: var(--amber);
        }
        .wp-eta-label { font-size: 13px; color: var(--muted); }

        .wp-timeline {
          list-style: none;
          display: flex;
          position: relative;
          padding: 24px 0 0;
          margin: 0;
        }
        .wp-timeline::before {
          content: '';
          position: absolute;
          top: 7px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: var(--line);
        }
        .wp-timeline-item {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          padding: 0 6px;
        }
        .wp-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--panel-2);
          border: 2px solid var(--muted);
          z-index: 1;
        }
        .wp-dot.done { background: var(--mint); border-color: var(--mint); }
        .wp-dot.current {
          background: var(--amber);
          border-color: var(--amber);
          box-shadow: 0 0 0 6px rgba(255,154,68,0.16);
          animation: wp-pulse 2s infinite;
        }
        @keyframes wp-pulse {
          0%, 100% { box-shadow: 0 0 0 5px rgba(255,154,68,0.16); }
          50% { box-shadow: 0 0 0 9px rgba(255,154,68,0.08); }
        }
        .wp-step-label { font-size: 13.5px; font-weight: 500; }
        .wp-step-label.pending { color: var(--muted); }
        .wp-step-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: var(--muted);
        }

        .wp-brand-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border-radius: 7px;
          flex-shrink: 0;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .wp-brand-sm { font-size: 10.5px; padding: 5px 8px; }
        .wp-brand-lg { font-size: 13px; padding: 7px 14px; border-radius: 8px; }

        .wp-pay {
          max-width: 1180px;
          margin: 0 auto;
          padding: 56px 32px 20px;
        }
        .wp-pay-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .wp-pay-head h2 { font-size: 26px; margin-top: 4px; }
        .wp-pay-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 26px;
          align-items: center;
          transition: transform 0.15s ease-out, border-color 0.15s;
          will-change: transform;
        }
        .wp-pay-methods { display: flex; flex-direction: column; gap: 10px; }
        .wp-pay-method {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
        }
        .wp-pay-method svg { flex-shrink: 0; color: var(--muted); }
        .wp-pay-method.active {
          border-color: rgba(255,154,68,0.4);
          background: rgba(255,154,68,0.07);
        }
        .wp-pay-method.active svg { color: var(--amber); }
        .wp-pay-method-label { display: block; font-size: 13.5px; font-weight: 500; }
        .wp-pay-method-hint { display: block; font-size: 12px; color: var(--muted); margin-top: 2px; }
        .wp-pay-divider { width: 1px; align-self: stretch; background: var(--line); }

        .wp-scan-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        .wp-scanner {
          position: relative;
          width: 190px;
          height: 190px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--panel-2);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wp-scanner.scanning { border-color: rgba(255,154,68,0.5); }
        .wp-scanner.success {
          border-color: rgba(79,224,168,0.5);
          box-shadow: 0 0 0 4px rgba(79,224,168,0.12);
        }
        .wp-qr-wrap { position: absolute; inset: 10%; transition: opacity 0.3s; }
        .wp-qr { width: 100%; height: 100%; display: block; border-radius: 4px; }
        .wp-scan-brackets {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          fill: none;
          stroke: var(--amber);
          stroke-width: 2.5;
          stroke-linecap: round;
          opacity: 0.85;
        }
        .wp-scan-line {
          position: absolute;
          left: 8%;
          right: 8%;
          height: 2px;
          top: 6%;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          opacity: 0;
        }
        .wp-scanner.scanning .wp-scan-line {
          opacity: 1;
          animation: wp-scanline 1.5s linear infinite;
        }
        @keyframes wp-scanline {
          0% { top: 8%; }
          100% { top: 88%; }
        }
        .wp-scan-success {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mint);
          animation: wp-pop 0.35s ease;
        }
        @keyframes wp-pop {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        .wp-cash-badge {
          width: 190px;
          height: 190px;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: var(--panel-2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: border-color 0.2s;
        }
        .wp-cash-badge.done {
          color: var(--mint);
          border-color: rgba(79,224,168,0.5);
          box-shadow: 0 0 0 4px rgba(79,224,168,0.12);
        }
        .wp-scan-status { font-size: 13.5px; max-width: 220px; color: var(--text); }
        .wp-scan-btn {
          background: var(--amber);
          color: #241205;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }
        .wp-scan-btn:disabled { opacity: 0.6; cursor: default; }
        .wp-scan-btn.ghost {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--muted);
          font-weight: 500;
        }
        .wp-scan-note { font-size: 11px; color: var(--muted); opacity: 0.8; }

        .wp-peak {
          max-width: 1180px;
          margin: 0 auto;
          padding: 70px 32px 20px;
        }
        .wp-peak-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .wp-peak-head h2 { font-size: 26px; margin-top: 4px; }

        .wp-peak-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 18px;
        }
        .wp-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 22px;
          transition: transform 0.15s ease-out, border-color 0.15s;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .wp-card:hover { border-color: rgba(255,154,68,0.25); }
        .wp-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wp-card-head h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
        }
        .wp-card-head svg { color: var(--amber); }
        .wp-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .wp-field {
          display: grid;
          gap: 6px;
        }
        .wp-field-label { font-size: 12px; color: var(--muted); }
        .wp-field-hint { font-size: 11px; color: var(--muted); opacity: 0.85; }
        .wp-field input, .wp-field select, .wp-field textarea {
          width: 100%;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 10px 11px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
        }
        .wp-field textarea { min-height: 96px; resize: vertical; }
        .wp-field input:focus-visible, .wp-field select:focus-visible, .wp-field textarea:focus-visible {
          outline: 2px solid rgba(255,154,68,0.55);
          outline-offset: 1px;
        }
        .wp-form .span-2 { grid-column: span 2; }
        .wp-form-actions { display: flex; gap: 10px; align-items: center; }

        .wp-mini {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--muted);
        }
        .wp-dashboard {
          display: grid;
          gap: 10px;
        }
        .wp-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: rgba(27,36,54,0.7);
        }
        .wp-row b { font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--text); }
        .wp-row span { color: var(--muted); font-size: 12.5px; }
        .wp-row.total {
          border-color: rgba(79,224,168,0.25);
          background: rgba(79,224,168,0.08);
        }
        .wp-row.total b { color: var(--mint); }

        .wp-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .wp-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--panel-2);
          border: 1px solid var(--line);
          color: var(--muted);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
        }
        .wp-pill.active {
          color: var(--text);
          border-color: rgba(255,154,68,0.4);
          background: rgba(255,154,68,0.08);
        }
        .wp-pill svg { color: var(--amber); }

        .wp-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .wp-bank-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px;
          display: grid;
          gap: 10px;
        }
        .wp-bank-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .wp-bank-head b { font-size: 13.5px; }
        .wp-bank-head span { font-size: 12px; color: var(--muted); }
        .wp-bank-qr {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--panel-2);
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
        }
        .wp-bank-qr .wp-qr, .wp-bank-qr .wp-qr-img { width: 100%; height: 100%; object-fit: cover; }
        .wp-bank-note { font-size: 12px; color: var(--muted); line-height: 1.5; }

        .wp-feedback-list { display: grid; gap: 10px; }
        .wp-feedback-item {
          border: 1px solid var(--line);
          background: rgba(19,26,41,0.6);
          border-radius: 14px;
          padding: 14px;
          display: grid;
          gap: 10px;
        }
        .wp-feedback-item b { font-size: 13px; }
        .wp-feedback-item audio, .wp-feedback-item video { width: 100%; }

        .wp-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .wp-contact-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 18px;
          display: grid;
          gap: 10px;
        }
        .wp-contact-row { display: flex; align-items: center; gap: 10px; color: var(--muted); }
        .wp-contact-row b { color: var(--text); font-weight: 600; }
        .wp-contact-row svg { color: var(--amber); }
        .wp-links { display: flex; flex-wrap: wrap; gap: 10px; }
        .wp-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 8px 12px;
          background: var(--panel-2);
          color: var(--text);
          text-decoration: none;
          font-size: 13px;
        }
        .wp-link:hover { border-color: rgba(255,154,68,0.35); }

        .wp-features {
          max-width: 1180px;
          margin: 0 auto;
          padding: 70px 32px 30px;
        }
        .wp-features h2 { font-size: 28px; margin-bottom: 30px; }
        .wp-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .wp-feature-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 22px;
          transition: transform 0.15s ease-out, border-color 0.15s;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .wp-feature-card:hover { border-color: rgba(255,154,68,0.3); }
        .wp-feature-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(255,154,68,0.1);
          color: var(--amber);
          margin-bottom: 16px;
        }
        .wp-feature-card h3 {
          font-size: 15.5px;
          font-weight: 600;
          margin: 0 0 8px;
          font-family: 'Inter', sans-serif;
        }
        .wp-feature-card p {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.5;
          margin: 0;
        }

        .wp-footer {
          max-width: 1180px;
          margin: 0 auto;
          padding: 46px 32px 40px;
          border-top: 1px solid var(--line);
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .wp-footer-brand { font-size: 13px; color: var(--muted); }
        .wp-footer-brand b { color: var(--text); font-family: 'Fraunces', serif; }

        .wp-peak-grid, .wp-feature-grid, .wp-contact-grid, .wp-grid-3, .wp-pay-panel, .wp-form, .wp-hero-content {
          min-width: 0;
          width: 100%;
        }
        .wp-card, .wp-feature-card, .wp-bank-card, .wp-contact-card, .wp-pay-methods, .wp-scan-area,
        .wp-timeline-item, .wp-track-box, .wp-pay-divider {
          min-width: 0;
          max-width: 100%;
        }
        .wp-nav, .wp-nav-mobile, .wp-hero, .wp-status, .wp-pay, .wp-peak, .wp-features, .wp-footer {
          width: 100%;
          min-width: 0;
          max-width: 100%;
        }
        .wp-nav {
          padding-left: max(18px, env(safe-area-inset-left));
          padding-right: max(18px, env(safe-area-inset-right));
        }
        .wp-nav-mobile {
          padding-left: max(20px, env(safe-area-inset-left));
          padding-right: max(20px, env(safe-area-inset-right));
        }
        .wp-hero-content, .wp-status, .wp-pay, .wp-peak, .wp-features, .wp-footer {
          padding-left: max(18px, env(safe-area-inset-left));
          padding-right: max(18px, env(safe-area-inset-right));
        }
        .wp-hero-hint { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90vw; }

        @media (max-width: 860px) {
          .wp-hero-content { grid-template-columns: 1fr; }
          .wp-feature-grid { grid-template-columns: 1fr 1fr; }
          .wp-peak-grid { grid-template-columns: 1fr; }
          .wp-grid-3 { grid-template-columns: 1fr 1fr; }
          .wp-contact-grid { grid-template-columns: 1fr; }
          .wp-timeline { flex-direction: column; align-items: flex-start; gap: 22px; }
          .wp-timeline::before { top: 0; bottom: 0; left: 6px; right: auto; width: 2px; height: auto; }
          .wp-timeline-item { flex-direction: row; text-align: left; align-items: center; width: 100%; }
          .wp-status-head { align-items: flex-start; }
          .wp-pay-head { align-items: flex-start; }
          .wp-eta { text-align: left; }
          .wp-pay-panel { grid-template-columns: 1fr; }
          .wp-pay-divider { width: auto; height: 1px; }
        }
        @media (max-width: 720px) {
          .wp-nav-links { display: none; }
          .wp-nav-cta-desktop { display: none; }
          .wp-nav-toggle { display: flex; }
          .wp-nav-mobile { display: flex; }
          .wp-form { grid-template-columns: 1fr; }
          .wp-form .span-2 { grid-column: span 1; }
          .wp-pay-panel { grid-template-columns: 1fr; padding: 20px; }
          .wp-pay-divider { width: auto; height: 1px; }
          .wp-grid-3 { grid-template-columns: 1fr 1fr; }
          .wp-feature-grid { grid-template-columns: 1fr 1fr; }
          .wp-contact-grid { grid-template-columns: 1fr; }
          .wp-hero-content { padding-bottom: 56px; }
          .wp-hero h1 { max-width: none; }
          .wp-track-input-row { flex-direction: column; }
          .wp-track-input-row button { padding: 11px 18px; }
        }
        @media (max-width: 520px) {
          .wp-feature-grid { grid-template-columns: 1fr; }
          .wp-nav { padding-top: 14px; padding-bottom: 14px; padding-left: max(18px, env(safe-area-inset-left)); padding-right: max(18px, env(safe-area-inset-right)); }
          .wp-hero-content, .wp-status, .wp-pay, .wp-features, .wp-footer {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }
          .wp-peak { padding-left: max(18px, env(safe-area-inset-left)); padding-right: max(18px, env(safe-area-inset-right)); }
          .wp-grid-3 { grid-template-columns: 1fr; }
          .wp-hero-hint { bottom: 160px; font-size: 11px; }
          .wp-vehicle-toggle { top: 16px; right: max(18px, env(safe-area-inset-right)); }
          .wp-vehicle-toggle button { padding: 6px 9px; font-size: 11.5px; }
          .wp-pay-methods { gap: 8px; }
          .wp-form { grid-template-columns: 1fr; }
          .wp-form .span-2 { grid-column: span 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wp-root * { animation: none !important; transition: none !important; }
        }
      `}</style>

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
          <button className="wp-nav-cta" onClick={() => goTo("track")}>
            Get the app
          </button>
        </div>
      )}

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

      <section className="wp-status wp-reveal" id="track">
        <div className="wp-status-head">
          <div>
            <span className="wp-route-chip">WP-2291 · Bole → Kazanchis</span>
            <h2>On the way — on schedule</h2>
          </div>
          <div className="wp-eta">
            <span className="wp-eta-num">14:38</span>
            <span className="wp-eta-label">Estimated arrival</span>
          </div>
        </div>

        <ol className="wp-timeline">
          {STEPS.map((step) => (
            <li className="wp-timeline-item" key={step.label}>
              <span className={`wp-dot ${step.status}`} />
              <div>
                <div className={`wp-step-label ${step.status === "pending" ? "pending" : ""}`}>
                  {step.label}
                </div>
                <div className="wp-step-meta">{step.time} · {step.place}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="wp-pay wp-reveal" id="pay">
        <div className="wp-pay-head">
          <div>
            <span className="wp-route-chip">WP-2291 · Pay on delivery</span>
            <h2>Scan to pay, or pay cash</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              Ethiopian couriers collect payment right at the door — a quick scan for mobile
              money, or cash confirmed on the spot.
            </p>
          </div>
          <div className="wp-eta">
            <span className="wp-eta-label">Amount due</span>
            <span className="wp-eta-num">{formatETB(640)}</span>
          </div>
        </div>

        <TiltCard className="wp-pay-panel">
          <div className="wp-pay-methods">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`wp-pay-method ${payMethod === m.id ? "active" : ""}`}
                  onClick={() => setPayMethod(m.id)}
                >
                  {m.id === "cash" ? (
                    <Icon size={17} strokeWidth={2} />
                  ) : (
                    <BrandBadge id={m.id} size="sm" />
                  )}
                  <span>
                    <span className="wp-pay-method-label">{m.label}</span>
                    <span className="wp-pay-method-hint">{m.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="wp-pay-divider" />

          {payMethod === "cash" ? (
            <CashPanel amount={640} />
          ) : (
            <ScannerPanel method={payMethod} waybill="WP-2291" amount={640} />
          )}
        </TiltCard>
      </section>

      <section className="wp-peak wp-reveal" id="pricing">
        <div className="wp-peak-head">
          <div>
            <span className="wp-route-chip">Pricing · Distance + automatic %</span>
            <h2>Price percentage dashboard</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              Set the base price and distance, then the service fee (%) and tax (%) calculate automatically.
            </p>
          </div>
          <div className="wp-eta">
            <span className="wp-eta-label">Total</span>
            <span className="wp-eta-num">{formatETB(pricing.total)}</span>
          </div>
        </div>

        <div className="wp-peak-grid">
          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <Calculator size={18} strokeWidth={2} />
              <h3>Inputs</h3>
            </div>
            <div className="wp-form">
              <Field label="Base price" hint="Example: item price or minimum fee">
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  min={0}
                />
              </Field>

              <Field label="Distance (km)" hint="Delivery distance">
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  min={0}
                />
              </Field>

              <Field label="Rate per km" hint="Cost per km">
                <input
                  type="number"
                  value={ratePerKm}
                  onChange={(e) => setRatePerKm(e.target.value)}
                  min={0}
                />
              </Field>

              <Field label="Service fee (%)" hint="Calculated on subtotal">
                <input
                  type="number"
                  value={feePercent}
                  onChange={(e) => setFeePercent(e.target.value)}
                  min={0}
                  max={100}
                />
              </Field>

              <Field label="Tax (%)" hint="Calculated after service fee">
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  min={0}
                  max={100}
                />
              </Field>

              <div className="wp-mini">
                Tip: you can rename “service fee” to “percentage” or “commission” once you confirm the exact wording.
              </div>
            </div>
          </TiltCard>

          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <Percent size={18} strokeWidth={2} />
              <h3>Breakdown</h3>
            </div>
            <div className="wp-dashboard">
              <div className="wp-row">
                <span>Distance cost</span>
                <b>{formatETB(pricing.distanceCost)}</b>
              </div>
              <div className="wp-row">
                <span>Subtotal (base + distance)</span>
                <b>{formatETB(pricing.sub)}</b>
              </div>
              <div className="wp-row">
                <span>Service fee ({pricing.feePct}%)</span>
                <b>{formatETB(pricing.fee)}</b>
              </div>
              <div className="wp-row">
                <span>Taxable amount</span>
                <b>{formatETB(pricing.taxable)}</b>
              </div>
              <div className="wp-row">
                <span>Tax ({pricing.taxPct}%)</span>
                <b>{formatETB(pricing.tax)}</b>
              </div>
              <div className="wp-row total">
                <span>Total</span>
                <b>{formatETB(pricing.total)}</b>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      <section className="wp-peak wp-reveal" id="products">
        <div className="wp-peak-head">
          <div>
            <span className="wp-route-chip">Products · Request form</span>
            <h2>Add the 3 products</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              Capture: price, model, phone number, brand, and quality for each request.
            </p>
          </div>
        </div>

        <div className="wp-pills" style={{ marginBottom: 14 }}>
          {PRODUCT_CATEGORIES.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                className={`wp-pill ${productCategory === p.id ? "active" : ""}`}
                onClick={() => setProductCategory(p.id)}
              >
                <Icon size={16} strokeWidth={2} />
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="wp-peak-grid">
          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <MessageSquare size={18} strokeWidth={2} />
              <h3>Product request</h3>
            </div>
            <div className="wp-form">
              <Field label="Price">
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  min={0}
                  placeholder="e.g. 2,500"
                />
              </Field>

              <Field label="Model">
                <input
                  type="text"
                  value={productModel}
                  onChange={(e) => setProductModel(e.target.value)}
                  placeholder="e.g. AX3000 / Series 6 / Dior Sauvage"
                />
              </Field>

              <Field label="Phone number" hint="How we contact the customer">
                <input
                  type="tel"
                  value={productPhone}
                  onChange={(e) => setProductPhone(e.target.value)}
                  placeholder="e.g. +251 9xx xxx xxx"
                />
              </Field>

              <Field label="Brand">
                <input
                  type="text"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  placeholder="e.g. Rolex / Casio / TP-Link"
                />
              </Field>

              <Field label="Brand & quality">
                <select value={productQuality} onChange={(e) => setProductQuality(e.target.value)}>
                  {QUALITY_OPTIONS.map((q) => (
                    <option key={q.id} value={q.id}>{q.label}</option>
                  ))}
                </select>
              </Field>

              <div className="wp-form-actions span-2">
                <button type="button" className="wp-scan-btn" onClick={submitProductRequest}>
                  Add request
                </button>
                <div className="wp-mini">
                  Required: model, phone, brand.
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <PackageCheck size={18} strokeWidth={2} />
              <h3>Recent requests</h3>
            </div>
            {productRequests.length ? (
              <div className="wp-feedback-list">
                {productRequests.map((r) => (
                  <div className="wp-feedback-item" key={r.id}>
                    <b>
                      {PRODUCT_CATEGORIES.find((p) => p.id === r.category)?.label || r.category}
                      {r.price ? ` · ${formatETB(r.price)}` : ""}
                    </b>
                    <div className="wp-mini">Model: {r.model}</div>
                    <div className="wp-mini">Brand: {r.brand} · Quality: {r.quality}</div>
                    <div className="wp-mini">Phone: {r.phone}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="wp-bank-note">
                No product requests yet — add one on the left.
              </div>
            )}
          </TiltCard>
        </div>
      </section>

      <section className="wp-peak wp-reveal" id="banks">
        <div className="wp-peak-head">
          <div>
            <span className="wp-route-chip">Banks · QR codes</span>
            <h2>All banks’ QR codes</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              Drop real QR images into <span className="wp-mono">public/bank-qrs/&lt;bankId&gt;.png</span>.
              If an image isn’t found, the site shows a placeholder QR pattern.
            </p>
          </div>
          <div className="wp-eta">
            <span className="wp-eta-label">Amount</span>
            <span className="wp-eta-num">{formatETB(bankAmount)}</span>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Field label="QR amount" hint="This only changes the placeholder seed">
            <input type="number" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} />
          </Field>
        </div>

        <div className="wp-grid-3">
          {ETHIOPIA_BANKS.map((b) => (
            <div className="wp-bank-card" key={b.id}>
              <div className="wp-bank-head">
                <b>{b.hint}</b>
                <span>{b.name}</span>
              </div>
              <div className="wp-bank-qr" aria-label={`${b.name} QR`}>
                <BankQr bankId={b.id} seed={`${b.id}-${bankAmount}`} alt={`${b.name} QR`} />
              </div>
              <div className="wp-bank-note">
                Replace with the real QR code image to meet the “all banks included” requirement.
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wp-peak wp-reveal" id="donate">
        <div className="wp-peak-head">
          <div>
            <span className="wp-route-chip">Donation · Strategy document</span>
            <h2>Donate to download the strategy</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              This is a front-end demo unlock (no real payment processing yet). Once you confirm payment,
              the download link appears.
            </p>
          </div>
        </div>

        <div className="wp-peak-grid">
          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <HeartHandshake size={18} strokeWidth={2} />
              <h3>Donation</h3>
            </div>
            <div className="wp-form">
              <Field label="Donation amount">
                <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} min={0} />
              </Field>

              <Field label="Method">
                <select value={donationMethod} onChange={(e) => setDonationMethod(e.target.value)}>
                  <option value="telebirr">Telebirr</option>
                  <option value="cbebirr">CBE Birr</option>
                  <option value="hellocash">HelloCash</option>
                  <option value="bank_qr">Bank QR (choose a bank above)</option>
                </select>
              </Field>

              <div className="span-2 wp-bank-note">
                Another donation option: call or message us directly and we’ll send a custom invoice link.
              </div>

              <div className="wp-form-actions span-2">
                <button
                  type="button"
                  className="wp-scan-btn"
                  onClick={() => setDocUnlocked(true)}
                >
                  Confirm I paid {formatETB(safeNum(donationAmount))}
                </button>
                {docUnlocked ? (
                  <button
                    type="button"
                    className="wp-scan-btn ghost"
                    onClick={() => setDocUnlocked(false)}
                  >
                    Lock
                  </button>
                ) : null}
              </div>
            </div>
          </TiltCard>

          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <FileText size={18} strokeWidth={2} />
              <h3>Strategy document</h3>
            </div>
            {docUnlocked ? (
              <div className="wp-dashboard">
                <div className="wp-row total">
                  <span>Access granted</span>
                  <b>Unlocked</b>
                </div>
                <a className="wp-link" href="/peak-strategy-document.txt" download>
                  <FileText size={16} strokeWidth={2} /> Download document
                </a>
                <div className="wp-bank-note">
                  Replace this placeholder file with your real strategy document later.
                </div>
              </div>
            ) : (
              <div className="wp-dashboard">
                <div className="wp-row">
                  <span>Status</span>
                  <b>Locked</b>
                </div>
                <div className="wp-bank-note">
                  Donate to unlock the download.
                </div>
              </div>
            )}
          </TiltCard>
        </div>
      </section>

      <section className="wp-peak wp-reveal" id="feedback">
        <div className="wp-peak-head">
          <div>
            <span className="wp-route-chip">Feedback · Voice / video</span>
            <h2>Customer feedback</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              Upload a short voice note or video testimonial and it will preview immediately.
            </p>
          </div>
        </div>

        <div className="wp-peak-grid">
          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <Mic size={18} strokeWidth={2} />
              <h3>Submit feedback</h3>
            </div>
            <div className="wp-form">
              <Field label="Text feedback" hint="Optional">
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tell us what went well (or what we should improve)" />
              </Field>

              <Field label="Voice/video files" hint="audio/* or video/*">
                <input
                  type="file"
                  accept="audio/*,video/*"
                  multiple
                  onChange={(e) => addFeedbackFiles(e.target.files)}
                />
              </Field>

              <div className="wp-form-actions span-2">
                <button
                  type="button"
                  className="wp-scan-btn"
                  onClick={() => {
                    if (!feedbackText.trim()) return;
                    setFeedbackItems((list) => [
                      {
                        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                        name: "Text feedback",
                        type: "text/plain",
                        url: "",
                        body: feedbackText.trim(),
                        createdAt: new Date().toISOString(),
                      },
                      ...list,
                    ].slice(0, 8));
                    setFeedbackText("");
                  }}
                >
                  Save text feedback
                </button>
                <div className="wp-mini">Saved locally in this session.</div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="wp-card">
            <div className="wp-card-head">
              <Video size={18} strokeWidth={2} />
              <h3>Recent feedback</h3>
            </div>
            {feedbackItems.length ? (
              <div className="wp-feedback-list">
                {feedbackItems.map((f) => (
                  <div className="wp-feedback-item" key={f.id}>
                    <b>{f.name}</b>
                    {f.type.startsWith("audio/") ? (
                      <audio controls src={f.url} />
                    ) : f.type.startsWith("video/") ? (
                      <video controls src={f.url} />
                    ) : (
                      <div className="wp-mini">{f.body}</div>
                    )}
                    <div className="wp-mini">{new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="wp-bank-note">No feedback submitted yet.</div>
            )}
          </TiltCard>
        </div>
      </section>

      <section className="wp-peak wp-reveal" id="contact">
        <div className="wp-peak-head">
          <div>
            <span className="wp-route-chip">Contact · Location</span>
            <h2>Contact & location</h2>
            <p className="wp-hero-sub" style={{ marginTop: 10 }}>
              Add your exact address and phone numbers here when you’re ready.
            </p>
          </div>
        </div>

        <div className="wp-contact-grid">
          <div className="wp-contact-card">
            <div className="wp-contact-row">
              <MapPin size={18} strokeWidth={2} />
              <b>Location</b>
            </div>
            <div className="wp-bank-note">
              Addis Ababa, Ethiopia (placeholder) — we can embed an exact map once you share the address.
            </div>
            <div className="wp-links">
              <a className="wp-link" href="https://www.google.com/maps" target="_blank" rel="noreferrer">
                <MapPin size={16} strokeWidth={2} /> Open Google Maps
              </a>
            </div>
          </div>

          <div className="wp-contact-card">
            <div className="wp-contact-row">
              <Phone size={18} strokeWidth={2} />
              <b>Phone</b>
            </div>
            <div className="wp-bank-note">+251 9XX XXX XXX (placeholder)</div>
            <div className="wp-links">
              <a className="wp-link" href="tel:+251900000000">
                <Phone size={16} strokeWidth={2} /> Call
              </a>
              <a className="wp-link" href="sms:+251900000000">
                <MessageSquare size={16} strokeWidth={2} /> SMS
              </a>
            </div>

            <div className="wp-contact-row" style={{ marginTop: 10 }}>
              <Send size={18} strokeWidth={2} />
              <b>Social</b>
            </div>
            <div className="wp-links">
              <a className="wp-link" href="#" onClick={(e) => e.preventDefault()}>
                <Send size={16} strokeWidth={2} /> Telegram
              </a>
              <a className="wp-link" href="#" onClick={(e) => e.preventDefault()}>
                <Video size={16} strokeWidth={2} /> TikTok
              </a>
              <a className="wp-link" href="#" onClick={(e) => e.preventDefault()}>
                <MessageSquare size={16} strokeWidth={2} /> Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wp-features wp-reveal" id="features">
        <h2>Built for the whole route</h2>
        <div className="wp-feature-grid">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <TiltCard
                className="wp-feature-card wp-reveal"
                key={f.title}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="wp-feature-icon">
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </TiltCard>
            );
          })}
        </div>
      </section>

      <footer className="wp-footer wp-reveal">
        <div className="wp-footer-brand"><b>Waypoint</b> — delivery you can see coming.</div>
        <div className="wp-footer-brand">© 2026 Waypoint Logistics</div>
      </footer>
    </div>
  );
}
