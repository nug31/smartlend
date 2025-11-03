# Railway Deployment Guide

## Prerequisites
- Railway account: https://railway.app
- GitHub repository with backend code
- PostgreSQL database already created in Railway

## Step-by-Step Deployment

### 1. Create New Project
1. Go to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose repository: `nug31/loan`
5. Select **"Deploy from a folder"**
6. Choose folder: `backend`

### 2. Configure Build Settings
Railway will automatically detect:
- **Build Command**: `npm install`
- **Start Command**: `node server-pg.js` (from railway.json)
- **Port**: Automatically assigned

### 3. Connect Database
1. In your project, click **"Connect"** or **"+"**
2. Select your existing PostgreSQL database
3. Railway will automatically set `DATABASE_URL` environment variable

### 4. Environment Variables
Railway will automatically set:
```
DATABASE_URL=postgresql://postgres:password@host:port/database
PORT=3000 (or assigned port)
NODE_ENV=production
```

### 5. Deploy
1. Click **"Deploy"**
2. Wait for build to complete
3. Check logs for any errors

### 6. Get Service URL
1. Go to **"Settings"** tab
2. Find **"Public Networking"**
3. Copy the generated URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### 7. Update Frontend
Update Netlify environment variables:
```
VITE_API_BASE_URL=https://your-backend-url.up.railway.app/api
```

## Testing Deployment

Test these endpoints:
- `https://your-backend-url.up.railway.app/health`
- `https://your-backend-url.up.railway.app/api/dashboard/stats`

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check package.json and dependencies
2. **Database Connection**: Verify DATABASE_URL is set
3. **CORS Errors**: Backend CORS is configured for Railway domains
4. **Port Issues**: Railway automatically assigns PORT

### Logs:
- Check deployment logs in Railway dashboard
- Use `console.log` statements for debugging

## Files Ready for Railway:
- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process configuration
- ✅ `package.json` - Updated with correct start command
- ✅ `server-pg.js` - CORS configured for Railway domains
