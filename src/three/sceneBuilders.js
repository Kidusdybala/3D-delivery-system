import * as THREE from "three";
import { WAYPOINTS } from "../lib/constants.js";
import { mulberry32 } from "../lib/utils.js";

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

  const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 0.62), mintMat);
  box.position.set(-0.1, 1.15, 0);
  group.add(box);

  const marker = box;

  const headlight = new THREE.PointLight(0xffb066, 1.3, 8, 2);
  headlight.position.set(1.0, 0.5, 0);
  group.add(headlight);

  const torch = new THREE.SpotLight(0xffd23f, 6, 16, Math.PI / 9, 0.25, 1.4);
  torch.position.set(0.95, 0.55, 0);
  const torchTarget = new THREE.Object3D();
  torchTarget.position.set(6, -0.1, 0);
  group.add(torch);
  group.add(torchTarget);
  torch.target = torchTarget;

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

  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.24), frameMat);
  rack.position.set(-0.55, 0.66, 0);
  group.add(rack);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.28), mintMat);
  box.position.set(-0.55, 0.83, 0);
  group.add(box);

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

  const torch = new THREE.SpotLight(0xffd23f, 5, 14, Math.PI / 9, 0.25, 1.4);
  torch.position.set(0.6, 0.85, 0);
  const torchTarget = new THREE.Object3D();
  torchTarget.position.set(6, 0.3, 0);
  group.add(torch);
  group.add(torchTarget);
  torch.target = torchTarget;

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

export {
  buildRoad,
  buildBuildings,
  disposeGroup,
  sharedMaterials,
  buildCar,
  buildBike,
  buildVehicle,
};
