# 🚀 Deploying to Render

This guide provides step-by-step instructions to deploy Pavithra Travels to [Render](https://render.com).

## 1. Prepare Your Repository
Ensure your latest code is pushed to a GitHub, GitLab, or Bitbucket repository. Render will connect to this repository to pull your code.

---

## 2. Deploy the Backend (Web Service)

The backend is located in the `/backend` directory.

### Step-by-Step:
1. Log in to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your repository.
4. Configure the Following:
   - **Name**: `pavithra-travels-api` (or similar)
   - **Environment**: `Node`
   - **Region**: Choose the one closest to you (e.g., Ohio, Singapore, etc.)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add the following **Environment Variables**:

| Key | Value (from your .env) |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` (Render will override this, but good to keep) |
| `FIREBASE_PROJECT_ID` | *Your Firebase Project ID* |
| `FIREBASE_PRIVATE_KEY` | *Your Firebase Private Key (include everything between quotes)* |
| `FIREBASE_CLIENT_EMAIL` | *Your Firebase Client Email* |
| `FIREBASE_DATABASE_URL` | *Your Firebase Database URL* |
| `JWT_SECRET` | *A unique long random string* |
| `JWT_EXPIRES_IN` | `7d` |
| `RESEND_API_KEY` | *Your Resend API Key* |
| `OWNER_EMAIL` | `pprawin48@gmail.com` |
| `CORS_ORIGIN` | *Wait until frontend is deployed, then add its URL here* |

6. Click **Create Web Service**.

> [!NOTE]
> Once deployed, Render will provide you with a URL (e.g., `https://pavithra-travels-api.onrender.com`). **Copy this URL** for the frontend setup.

---

## 3. Deploy the Frontend (Static Site)

The frontend is located in the root directory.

### Step-by-Step:
1. Go back to the Render Dashboard.
2. Click **New +** and select **Static Site**.
3. Connect the same repository.
4. Configure the Following:
   - **Name**: `pavithra-travels`
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty/Default)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click **Advanced** and add the following **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |
| `VITE_FIREBASE_API_KEY` | *Your Firebase Web API Key* |
| `VITE_FIREBASE_AUTH_DOMAIN` | *Your Firebase Project Domain* |
| `VITE_FIREBASE_PROJECT_ID` | *Your Firebase Project ID* |
| `VITE_FIREBASE_STORAGE_BUCKET` | *Your Storage Bucket* |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | *Your Sender ID* |
| `VITE_FIREBASE_APP_ID` | *Your App ID* |
| `VITE_FIREBASE_MEASUREMENT_ID` | *Your Measurement ID* |
| `VITE_UNSPLASH_ACCESS_KEY` | *Your Unsplash Access Key* |

6. Click **Create Static Site**.

---

## 4. Final Connection (CORS)

Once your **Static Site** is deployed, you will get a URL (e.g., `https://pavithra-travels.onrender.com`).

1. Go to your **Backend Web Service** settings on Render.
2. Click **Environment**.
3. Update the `CORS_ORIGIN` variable to include your frontend URL.
4. Save changes. Render will automatically redeploy the backend.

---

## Troubleshooting

### "White Screen" on Frontend
Ensure `VITE_API_URL` includes the `/api` suffix and that you've used the `https` version of your backend URL.

### Firebase Credentials Error
If you see errors related to `FIREBASE_PRIVATE_KEY`, ensure the newlines (`\n`) are preserved properly in the Render environment variable input.

### API Connection Refused
Check that the `CORS_ORIGIN` in the backend matches the frontend URL exactly (no trailing slash).
