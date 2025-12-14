# Deployment Guide

## Frontend Deployment to Netlify

### Option 1: Deploy via GitHub (Recommended)

1. **Login to Netlify**: Go to https://app.netlify.com
2. **New Site from Git**: Click "New site from Git"
3. **Connect to GitHub**: Choose GitHub and authorize
4. **Select Repository**: Choose `nug31/loan`
5. **Configure Build Settings**:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Environment Variables**: Add in Site Settings > Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.herokuapp.com/api
   VITE_APP_NAME=Loan Management System
   VITE_APP_VERSION=1.0.0
   ```
7. **Deploy**: Click "Deploy site"

### Option 2: Manual Deploy

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## Backend Deployment Options

### Option 1: Heroku (Recommended)

1. **Create Heroku App**:
   ```bash
   heroku create your-loan-backend
   ```

2. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   heroku git:remote -a your-loan-backend
   git push heroku main
   ```

### Option 2: Railway

1. Go to https://railway.app
2. Connect GitHub repository
3. Select backend folder
4. Add PostgreSQL database
5. Deploy

### Option 3: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure build settings
5. Add PostgreSQL database

## Environment Variables for Backend

```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3002
NODE_ENV=production
```

## Post-Deployment Steps

1. **Update Frontend Environment**:
   - Update `VITE_API_BASE_URL` in Netlify environment variables
   - Redeploy frontend

2. **Test Application**:
   - Test login/registration
   - Test API endpoints
   - Verify database connections

3. **Configure Custom Domain** (Optional):
   - Add custom domain in Netlify
   - Configure DNS settings

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure backend CORS is configured for frontend domain
2. **API Connection**: Verify API URL in environment variables
3. **Database Connection**: Check DATABASE_URL format
4. **Build Errors**: Check Node.js version compatibility

### Logs:

- **Netlify**: Site Settings > Functions > View logs
- **Heroku**: `heroku logs --tail -a your-app-name`
- **Railway**: Check deployment logs in dashboard
