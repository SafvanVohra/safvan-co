# Vohra & Co. Chartered Accountants

MERN website for a CA firm:

- Frontend: React + Vite, deployable on Vercel
- Backend: Node.js + Express, deployable on Render
- Database: MongoDB Atlas via Mongoose

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

Frontend URL: `http://localhost:5173`

Backend URL: `http://localhost:10000`

## Database

The backend stores enquiries in MongoDB via Mongoose.

Create a MongoDB Atlas connection string and set this environment variable on Render and in `server/.env`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vohra_ca?retryWrites=true&w=majority
```

The contact form posts to `POST /api/enquiries`.

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
- Environment variables:
  - `MONGODB_URI`
  - `CORS_ORIGIN=https://your-vercel-domain.vercel.app`
  - `NODE_ENV=production`
