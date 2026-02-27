# GeoSentinel

GeoSentinel is a production-oriented real-time tracking platform with:
- React + Vite + Tailwind + Framer Motion frontend
- Node.js + Express + MongoDB + Mongoose backend
- Socket.IO real-time streaming
- JWT authentication + protected routes
- Leaflet live map with smooth marker transitions
- Device management, activity feed, and optional admin analytics

## Monorepo Structure

```text
GEO/
  client/            # React app
  server/            # Express API + Socket.IO server
  docker-compose.yml
  package.json       # workspace scripts
```

## Quick Start (Local)

## 1) Prerequisites
- Node.js 20+
- npm 10+
- MongoDB (local or remote)

## 2) Install dependencies

```bash
npm install
npm install --workspace server
npm install --workspace client
```

## 3) Configure environment

Copy templates:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set required values:
- `server/.env`: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`
- `client/.env`: `VITE_API_URL`, `VITE_SOCKET_URL`

## 4) Run development

```bash
npm run dev
```

Apps:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Socket.IO: `http://localhost:5000`

## Docker Deployment (Optional)

1. Create `server/.env` from template.
2. Build and run:

```bash
docker compose up --build
```

Services:
- Client: `http://localhost:8080`
- Server: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Core Features

- Realtime dashboard:
  - Live multi-device map tracking
  - Smooth animated marker position transitions
  - Auto-center toggle
  - Activity stream + online/offline status
- Auth:
  - Register / login / logout
  - JWT-based route protection
- Device management:
  - Add / rename / remove devices
  - Unique tracking ID + one-time ingest key generation
  - Search and filter
- Admin:
  - Active users table
  - Global analytics cards
  - Realtime monitoring feed
- Performance:
  - Debounced geolocation sender (client)
  - Throttled map state updates (client)
  - Room-based Socket.IO broadcasts (server)
  - Broadcast smoothing queue (server)

## API Overview

Base URL: `/api`

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /devices`
- `POST /devices`
- `PATCH /devices/:deviceId`
- `DELETE /devices/:deviceId`
- `GET /devices/:deviceId/history`
- `POST /devices/:deviceId/location` (authenticated dashboard updates)
- `POST /tracking/:trackingId/location` (device ingestion using `x-device-key`)
- `GET /admin/overview` (admin only)
- `GET /admin/users/active` (admin only)

## Socket Events

Client emits:
- `tracking:subscribe` `{ deviceIds: string[] }`
- `tracking:unsubscribe` `{ deviceIds: string[] }`

Server emits:
- `location:updated`
- `activity:location`
- `device:status`
- `system:connections`
- Admin rooms:
  - `admin:location`
  - `admin:device-status`

## Security and Reliability

- Helmet security headers
- CORS controlled by `CLIENT_ORIGIN`
- Global + auth + tracking rate limits
- Input validation with `express-validator`
- Centralized error middleware
- Device ingest key verification via bcrypt hash compare

## Production Notes

- Replace `JWT_SECRET` with a strong secret.
- Restrict `CLIENT_ORIGIN` to your actual domain(s).
- Use managed MongoDB and TLS in production.
- Add reverse proxy (Nginx/Cloud load balancer) in front of server.
- Add centralized logging and metrics (Datadog/Grafana/ELK).

