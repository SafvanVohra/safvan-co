# Vohra & Co. Chartered Accountants

Full-stack website for a CA firm:

- Frontend: React + Vite, deployable on Vercel
- Backend: Express API, deployable on Render
- Database: Supabase `contact_enquiries` table

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`.

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
npm run dev
```

## Supabase

Run `supabase-schema.sql` in the Supabase SQL Editor once. The backend inserts enquiries into `public.contact_enquiries`.

For production, set these Render environment variables:

```bash
SUPABASE_URL=https://nzkbgcmgkwzjkppoqriy.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

`SUPABASE_SERVICE_ROLE_KEY` is recommended for the Render backend. Do not add it to Vercel or frontend code.

## Deploy

Vercel frontend:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable after backend is live: `VITE_API_URL=https://your-render-service.onrender.com`

Render backend:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
