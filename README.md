# VentureVista frontend

React and Vite frontend for VentureVista.

## API configuration

The frontend reads `VITE_API_URL` at build time. In Vercel, set this environment variable in **Project Settings → Environment Variables** for each deployment environment you use, then redeploy:

```text
VITE_API_URL=https://rpv01-backend-1.onrender.com
```

Set the backend origin without a path; the API client appends `/api/v1` exactly once. A value that already ends in `/api/v1` is also accepted. For local development, copy `.env.example` to `.env.local` and adjust the URL if needed.

Authentication uses cross-origin cookies. The frontend includes credentials on API requests; the backend must allow the deployed frontend origin and credentialed requests.

## Development and validation

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
```
