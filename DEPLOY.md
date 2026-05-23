# 🚀 HealTogether Deployment Guide

This guide contains everything you need to deploy **HealTogether** (Next.js frontend & Node.js Express backend) to the cloud for free.

---

## 💻 1. Deploy the Frontend (Next.js) to Vercel

The easiest way to deploy the frontend is using **Vercel**. It is 100% free and auto-updates every time you push code to GitHub.

### One-Click Deploy Link:
Use this direct link to start a deployment on Vercel:
👉 **[Deploy HealTogether Frontend on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/hello-world)** 
*(Note: Once you push your code to your own GitHub repository, replace the `repository-url` in the link with your own GitHub URL to deploy your exact custom code).*

### Manual Steps on Vercel:
1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your **HealTogether** GitHub repository.
4. Select the `frontend` folder as the Root Directory.
5. In **Environment Variables**, configure the backend URL:
   * Key: `NEXT_PUBLIC_API_URL`
   * Value: `https://your-backend-url.onrender.com` (Your deployed backend URL)
6. Click **Deploy**!

---

## ⚙️ 2. Deploy the Backend (Node.js Express + MySQL)

You can deploy your backend API server and database for free on **Render** or **Railway**.

### Option A: Deploy on Render (Recommended)
1. Go to [Render](https://render.com/) and create a free account.
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Select the `backend` folder as the Root Directory.
5. Set the following settings:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npx prisma generate`
   * **Start Command**: `node server.js`
6. Add your **Environment Variables** in Render's dashboard:
   * `DATABASE_URL`: `mysql://your-db-credentials` (You can create a free MySQL database on [Aiven](https://aiven.io/) or [Railway](https://railway.app/))
   * `JWT_SECRET`: `healtogether_secret_key_jwt_99881122`
   * `SMTP_USER`: `yanapartiharika@gmail.com`
   * `SMTP_PASS`: `ujfwijhjnzqhznkq`
   * `GOOGLE_CLIENT_ID`: `491481553436-fl571t8heaan3gt6ar7n6lltkvrpgdrs.apps.googleusercontent.com`
7. Click **Create Web Service**!

---

## 🛠️ Deployed App Integration Checklist
After deployment, make sure to update these two files with your live web URLs:
1. **Frontend Google API Origin**: In your Google Cloud Console, add your live Vercel URL (e.g. `https://heal-together.vercel.app`) under **Authorized JavaScript origins** and **Authorized redirect URIs**.
2. **Backend CORS Setup**: In your backend [server.js](file:///c:/Users/yanap/Downloads/heal_together/backend/server.js), update the allowed CORS origins to match your live Vercel frontend URL:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.vercel.app'],
     credentials: true
   }));
   ```
