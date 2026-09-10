<div align="center">
  <h1>3D Delivery System</h1>
  <p>Interactive 3D waypoint / delivery visualization built with <strong>React</strong>, <strong>Three.js</strong>, and <strong>Vite</strong>.</p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Run Locally](#run-locally)
  - [Build](#build)
  - [Preview Production Build](#preview-production-build)
- [Project Structure](#project-structure)
- [Deployment (Vercel)](#deployment-vercel)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

This project is a lightweight 3D delivery/waypoint visualization. It uses React for UI composition and Three.js for rendering the 3D scene.

## Tech Stack

- **React 18**
- **Three.js**
- **Vite 5**

## Features

- 3D scene rendered with Three.js
- Waypoint / route visualization
- Simple, fast dev experience (Vite)

## Getting Started

### Prerequisites

- Node.js **18+** recommended
- npm (the repo includes `package-lock.json`)

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```text
.
├─ public/
│  └─ peak-strategy-document.txt
├─ src/
│  └─ main.jsx              # React entry
├─ waypoint-delivery.jsx    # Main 3D / scene logic
├─ index.html
├─ vite.config.js
├─ package.json
└─ package-lock.json
```

## Deployment (Vercel)

### Option A: Import from GitHub (recommended)

1. In Vercel, click **New Project**.
2. Import the GitHub repository.
3. Use these settings:

- **Framework preset:** Vite
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `dist`

### Option B: CLI deploy

If you prefer the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Troubleshooting

- **Blank page after deploy**: confirm the Vercel **Output directory** is `dist` and the build is using `npm run build`.
- **Build fails**: make sure you’re using a recent Node version (18+).

## License

No license specified yet.
