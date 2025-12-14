# Fix Railway Backend Deployment

## Problem
Railway is currently serving the frontend HTML instead of the backend API.
This means the backend service is not properly configured.

## Solution Steps

### 1. Check Railway Dashboard
- Go to https://railway.app
- Find your project
- Check which service is running on `loan-production-a1a2.up.railway.app`

### 2. Re-deploy Backend Service

#### Option A: Create New Backend Service
1. In Railway dashboard, click **"+ New Service"**
2. Choose **"GitHub Repo"**
3. Select `nug31/loan` repository
4. Choose **"Deploy from a folder"**
5. Select folder: `backend`
6. Wait for deployment

#### Option B: Fix Existing Service
1. Go to existing service settings
2. Check **"Source"** - should point to `backend` folder
3. Check **"Build Command"** - should be `npm install`
4. Check **"Start Command"** - should be `node server-pg.js`
5. Redeploy if needed

### 3. Connect Database
1. In Railway project, click **"Connect"**
2. Select your existing PostgreSQL database
3. Railway will automatically set `DATABASE_URL`

### 4. Set Environment Variables
Ensure these are set:
```
NODE_ENV=production
PORT=(automatically set by Railway)
DATABASE_URL=(automatically set when database connected)
```

### 5. Test Backend
After deployment, test:
- `https://your-new-backend-url.up.railway.app/health`
- Should return: `{"status":"OK","database":"PostgreSQL"}`

### 6. Update Frontend
Update Netlify environment variable:
```
VITE_API_BASE_URL=https://your-new-backend-url.up.railway.app/api
```

## Alternative: Deploy to Render.com

If Railway continues to have issues:

### 1. Go to Render.com
- Sign up/login at https://render.com
- Connect GitHub account

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect `nug31/loan` repository
- Choose **"backend"** folder

### 3. Configure Service
```
Name: loan-backend
Environment: Node
Build Command: npm install
Start Command: node server-pg.js
```

### 4. Add Database
- Create PostgreSQL database in Render
- Copy connection string to `DATABASE_URL`

### 5. Deploy
- Click **"Create Web Service"**
- Wait for deployment
- Test health endpoint

## Current Status
- Frontend: ✅ Working on Netlify
- Backend: ❌ Railway serving wrong content
- Database: ✅ PostgreSQL ready on Railway

## Next Steps
1. Fix Railway backend deployment OR
2. Deploy backend to Render.com
3. Update frontend environment variables
4. Test full application
