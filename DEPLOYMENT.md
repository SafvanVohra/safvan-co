# GitHub, Vercel and Render Deployment

This project is now MERN:

- MongoDB Atlas for enquiries
- Express + Node API in `server/`
- React + Vite frontend in `src/`

## 1. Push to GitHub

```bash
git add .
git commit -m "Convert CA website to MERN stack"
git push origin main
```

## 2. Deploy Backend on Render

Create a new **Web Service** from the GitHub repo.

Use these settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Add these environment variables:

```text
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

After deploy, check:

```text
https://your-render-service.onrender.com/api/health
```

## 3. Deploy Frontend on Vercel

Import the same GitHub repo into Vercel.

Use these settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Add this environment variable:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

Redeploy Vercel after adding the variable.

## 4. Test Contact Form

Open the Vercel website and submit the contact form. It should save into MongoDB through the Render backend.
