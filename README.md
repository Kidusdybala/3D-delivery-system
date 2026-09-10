# 3D Delivery System (Waypoint Delivery)

Interactive 3D waypoint/delivery visualization built with **React**, **Three.js**, and **Vite**.

## Tech stack

- React 18
- Three.js
- Vite 5

## Features

- 3D scene rendered with Three.js
- Waypoint / route visualization
- Lightweight UI layer (React)

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm (works with other Node package managers too, but this repo includes a `package-lock.json`)

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project structure

```text
.
├─ public/
├─ src/
│  └─ main.jsx              # React entry
├─ waypoint-delivery.jsx    # Main 3D/scene logic
├─ index.html
├─ vite.config.js
└─ package.json
```

## Deployment (Vercel)

1. In Vercel, click **New Project** → import the GitHub repo.
2. Use these settings (Vite):

- **Framework preset:** Vite
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `dist`

If you ever see a blank page after deploy, double-check the **Output directory** is set to `dist`.

## License

No license specified yet.
