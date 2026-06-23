# Render Backend Setup

Use this file when creating the backend service on Render.

GitHub repo:

```text
https://github.com/SafvanVohra/safvan-co
```

Service settings:

```text
Name: vohra-ca-api
Runtime: Node
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Environment variables:

```text
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://safvan-co.vercel.app
MONGODB_URI=your_mongodb_atlas_connection_string
```

After Render gives you a URL, add it to Vercel:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

Then redeploy Vercel so the contact form uses the Render API.
