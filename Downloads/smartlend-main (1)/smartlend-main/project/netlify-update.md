# Update Netlify Environment Variables

## Railway Backend URL
Your backend is now live at: `https://loan-production-a1a2.up.railway.app`

## Steps to Update Netlify

### 1. Go to Netlify Dashboard
- Open https://app.netlify.com
- Find your loan management site
- Click on the site name

### 2. Update Environment Variables
- Go to **Site settings** → **Environment variables**
- Update or add these variables:

```
VITE_API_BASE_URL=https://loan-production-a1a2.up.railway.app/api
VITE_APP_NAME=Loan Management System
VITE_APP_VERSION=1.0.0
VITE_DEMO_MODE=false
```

### 3. Trigger Redeploy
- Go to **Deploys** tab
- Click **"Trigger deploy"** → **"Deploy site"**
- Wait for deployment to complete

## Test Backend Endpoints

Before updating Netlify, test these Railway endpoints:

### Health Check
```
https://loan-production-a1a2.up.railway.app/health
```
Should return: `{"status":"OK","database":"PostgreSQL"}`

### Dashboard Stats
```
https://loan-production-a1a2.up.railway.app/api/dashboard/stats
```
Should return dashboard statistics

### Test Login
```
POST https://loan-production-a1a2.up.railway.app/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

## After Netlify Update

1. **Test Frontend**: Visit your Netlify site
2. **Try Login**: Use admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. **Check Console**: No more "Failed to fetch" errors
4. **Test Features**: Dashboard, items, loans should work

## Default Users (Seeded in Database)

### Admin User
- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin

### Regular User
- Email: `john.doe@example.com`
- Password: `user123`
- Role: User

## Troubleshooting

### If Login Still Fails:
1. Check browser console for CORS errors
2. Verify Railway backend is running
3. Check Netlify environment variables are correct
4. Clear browser cache and try again

### If Database is Empty:
- Railway backend automatically seeds sample data on startup
- Check Railway logs for database sync messages
