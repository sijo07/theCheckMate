# Vercel Deployment Guide for CheckMate

Your project is now ready for "100% Vercel Deployment" (Frontend + Backend).

## 1. Project Settings in Vercel

When importing your project into Vercel, use the following settings:

- **Framework Preset**: Vite
- **Root Directory**: `.` (Root)
- **Build Command**: `cd frontend && npm install --legacy-peer-deps && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install` (or default)

> **Note**: If Vercel tries to start the backend with `npm start`, ignore it. Vercel automatically detects the `api` folder and deploys it as Serverless Functions.

## 2. Environment Variables

You **MUST** set the following Environment Variables in the Vercel Project Settings for the application to work:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Connection String (production). |
| `JWT_SECRET` | `...` | Your JWT Secret Key. |
| `CLIENT_URL` | `https://your-project.vercel.app` | The URL of your deployed frontend. |
| `VITE_BASE_URL` | `""` | Set this to an empty string to use relative paths (recommended for monorepo) OR your full production URL. |
| `NODE_ENV` | `production` | Set to production. |

## 3. Important Notes

### Socket.IO Limitation
Vercel Serverless Functions **do not support persistent WebSocket connections** (Socket.IO). 
- The features relying on live sockets (e.g., Live Map real-time updates) might fallback to polling or fail to connect.
- **Recommendation**: For a production Vercel app, consider using an external service like Pusher, Ably, or a separate backend server (Render/Heroku) for the WebSocket layer.

### Database Connection
The application is configured to connect to MongoDB on every API request. This is standard for serverless. Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) or whitelist Vercel IPs if possible (though 0.0.0.0/0 is easier).

## 4. Changes Made

- **Fixed Component Imports**: Renamed `footer_temp.jsx` to `Footer.jsx`, and others to match React standards.
- **Backend CORS**: Updated `backend/app.js` to allow connections from your Vercel URL.
- **Frontend Build**: Verified the frontend builds successfully with `vite build`.
