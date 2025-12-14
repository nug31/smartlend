# 🚀 SmartLend Deployment Guide

## 📋 Informasi Deployment

### Backend Railway
- **URL**: `https://smartlend-production.up.railway.app`
- **Repository**: `https://github.com/nug31/smartlend.git`
- **Branch**: `main`

---

## 🔧 Railway Backend Setup

### 1. Login ke Railway
1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub account
3. Authorize Railway untuk akses repository

### 2. Create New Project
1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository **`nug31/smartlend`**

### 3. Add PostgreSQL Database
1. Di Railway project dashboard, klik **"New"**
2. Pilih **"Database"** → **"PostgreSQL"**
3. Railway akan create database dan generate credentials
4. Database akan auto-generate `DATABASE_URL`

### 4. Deploy Backend Service
1. Klik **"New"** → **"GitHub Repo"**
2. Pilih **`nug31/smartlend`**
3. Railway akan detect Node.js project

### 5. Configure Backend Service

#### **Settings → General:**
- **Service Name**: `smartlend-backend` (atau nama lain)

#### **Settings → Source:**
- **Root Directory**: `project/backend`
- **Build Command**: `npm install` (auto-detected)
- **Start Command**: `node server-pg.js`

#### **Settings → Deploy:**
- **Branch**: `main`
- **Auto Deploy**: ✅ Enabled

### 6. Connect Database to Backend
1. Di backend service, klik **"Variables"** tab
2. Klik **"New Variable"** → **"Add Reference"**
3. Pilih PostgreSQL database
4. Pilih `DATABASE_URL`
5. Railway akan auto-link database

### 7. Set Environment Variables

Di **Variables** tab, tambahkan:

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=${{PORT}}
```

**Optional (untuk production):**
```env
JWT_SECRET=your_super_secure_random_string_here
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### 8. Deploy!
1. Klik **"Deploy"** atau push ke GitHub (auto-deploy)
2. Monitor logs di **"Deployments"** tab
3. Tunggu hingga status **"Success"** ✅

### 9. Get Public URL
1. Di service settings, klik **"Networking"** tab
2. Klik **"Generate Domain"**
3. Railway akan generate URL: `smartlend-production.up.railway.app`
4. Copy URL ini untuk frontend configuration

### 10. Test Backend
Test endpoints berikut:

```bash
# Health check
curl https://smartlend-production.up.railway.app/health

# Expected response:
{"status":"OK","database":"PostgreSQL"}

# Test API
curl https://smartlend-production.up.railway.app/api/dashboard/stats
```

---

## 🌐 Frontend Deployment (Netlify)

### 1. Login ke Netlify
1. Buka [netlify.com](https://netlify.com)
2. Login dengan GitHub account

### 2. Deploy from GitHub
1. Klik **"Add new site"** → **"Import an existing project"**
2. Pilih **"Deploy with GitHub"**
3. Pilih repository **`nug31/smartlend`**

### 3. Configure Build Settings

```
Base directory: project
Build command: npm run build
Publish directory: project/dist
```

### 4. Set Environment Variables

Di **Site settings** → **Environment variables**, tambahkan:

```env
VITE_API_BASE_URL=https://smartlend-production.up.railway.app/api
VITE_APP_NAME=SmartLend - Loan Management System
VITE_APP_VERSION=1.0.0
VITE_DEMO_MODE=false
NODE_VERSION=18
```

### 5. Deploy
1. Klik **"Deploy site"**
2. Tunggu build selesai
3. Netlify akan generate URL: `https://your-site-name.netlify.app`

### 6. Update CORS (Backend)
Setelah dapat Netlify URL, update backend CORS jika perlu.

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] PostgreSQL database created
- [ ] Backend service deployed successfully
- [ ] `DATABASE_URL` connected
- [ ] Environment variables set
- [ ] Public domain generated
- [ ] `/health` endpoint returns `{"status":"OK"}`
- [ ] API endpoints accessible

### Frontend (Netlify)
- [ ] Build successful
- [ ] Environment variables set correctly
- [ ] Site deployed and accessible
- [ ] Can connect to Railway backend
- [ ] Login/Register works
- [ ] Dashboard loads data

---

## 🔍 Troubleshooting

### Backend Issues

#### Build Fails
```bash
# Check logs in Railway dashboard
# Common issues:
- Missing dependencies in package.json
- Node version mismatch
- Build command incorrect
```

**Solution:**
- Verify `package.json` has all dependencies
- Set Node version to 18+ in Railway settings
- Check build logs for specific errors

#### Database Connection Error
```bash
# Error: "Unable to connect to database"
```

**Solution:**
- Verify `DATABASE_URL` is set in Variables
- Check PostgreSQL service is running
- Ensure SSL is enabled in database config

#### 404 Not Found
```bash
# Error: Application not found
```

**Solution:**
- Check Root Directory is set to `project/backend`
- Verify Start Command is `node server-pg.js`
- Redeploy the service

### Frontend Issues

#### API Connection Error
```bash
# Error: "Network Error" or "CORS Error"
```

**Solution:**
- Verify `VITE_API_BASE_URL` is correct
- Check Railway backend is running
- Test backend URL directly in browser

#### Build Fails
```bash
# Error during npm run build
```

**Solution:**
- Check all dependencies installed
- Verify TypeScript has no errors
- Check build logs in Netlify

---

## 📊 Monitoring

### Railway Dashboard
- **Deployments**: View deployment history and logs
- **Metrics**: Monitor CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Database**: Monitor database connections and queries

### Netlify Dashboard
- **Deploys**: View build history
- **Functions**: Monitor serverless functions (if any)
- **Analytics**: Site traffic and performance

---

## 🔄 Update & Redeploy

### Auto Deploy (Recommended)
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Railway and Netlify will auto-deploy

### Manual Deploy
**Railway:**
- Go to service → Deployments → "Deploy"

**Netlify:**
- Go to Deploys → "Trigger deploy"

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong JWT_SECRET** (random 32+ characters)
3. **Enable HTTPS** (Railway provides SSL automatically)
4. **Set proper CORS origins** in production
5. **Use environment variables** for all secrets
6. **Regular database backups** (Railway provides automatic backups)

---

## 📞 Support

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Netlify
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support

---

## 🎉 Success!

Jika semua langkah berhasil, aplikasi Anda sekarang:
- ✅ Backend running di Railway dengan PostgreSQL
- ✅ Frontend deployed di Netlify
- ✅ Database connected dan seeded
- ✅ API endpoints accessible
- ✅ Auto-deploy enabled

**Live URLs:**
- Backend: `https://smartlend-production.up.railway.app`
- Frontend: `https://your-site.netlify.app`

Selamat! SmartLend sudah live! 🚀

