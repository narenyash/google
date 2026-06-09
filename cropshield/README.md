# CropShield

CropShield is a hackathon-ready crop incident response scaffold. It includes a React farmer-facing demo flow and a Node.js backend that runs mock agent modules for pest detection, food safety guidance, village memory, outbreak mapping, and alerts.

## Project structure

```text
cropshield/
  frontend/   React app for the farmer workflow
  backend/    Node.js API and agent modules
```

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

## Run the backend

```bash
cd backend
npm install
npm run dev
```

The backend exposes:

- `GET /health`
- `POST /api/analyze`
- `GET /api/farms`
- `GET /api/alerts`
