# Railway Deployment Guide

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add backend with database models"
   git push origin main
   ```

## Step 2: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project"

## Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. Note down the connection details (you'll need them later)

## Step 4: Deploy Your Backend

1. In the same project, click **"New Service"** again
2. Select **"GitHub Repo"**
3. Connect your GitHub repository
4. Railway will auto-detect it's a Node.js project

## Step 5: Configure Environment Variables

1. Go to your backend service in Railway
2. Click on the **"Variables"** tab
3. Add these environment variables:

```env
# Database (Railway PostgreSQL variables)
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_here_make_it_long_and_random

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Optional: Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Step 6: Link Database to Backend

1. In your backend service, go to **"Settings"**
2. Under **"Connect"**, click **"Connect Database"**
3. Select your PostgreSQL database
4. Railway will automatically add the database environment variables

## Step 7: Deploy

1. Railway will automatically detect your `package.json`
2. It will run:
   - `npm install`
   - `npm start`
3. Your backend will be deployed to a Railway URL like: `https://your-app-name.railway.app`

## Step 8: Test Your Deployment

1. Visit your Railway URL + `/health`
   - Example: `https://your-app-name.railway.app/health`
2. You should see:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "database": "Connected"
   }
   ```

## Step 9: Update Frontend Configuration

Update your frontend to use the Railway backend URL:

```typescript
// In your frontend, update API base URL
const API_BASE_URL = 'https://your-app-name.railway.app';
```

## Troubleshooting

### Database Connection Issues
- Check that database environment variables are set correctly
- Ensure the database service is running
- Verify SSL settings for production

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (18+)
- Review build logs in Railway dashboard

### Environment Variables
- Make sure all required variables are set
- Check for typos in variable names
- Verify JWT_SECRET is set and secure

## Railway CLI (Optional)

You can also deploy using Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link your project
railway link

# Deploy
railway up
```

## Monitoring

1. **Logs**: View real-time logs in Railway dashboard
2. **Metrics**: Monitor CPU, memory, and network usage
3. **Database**: Check database performance and connections
4. **Health Checks**: Set up health check endpoints

## Custom Domain (Optional)

1. In Railway dashboard, go to your service
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Configure DNS records as instructed

## Cost Optimization

- Railway offers a free tier with usage limits
- Monitor your usage in the dashboard
- Consider upgrading for production workloads
- Use environment-specific configurations

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **JWT Secret**: Use a strong, random secret
3. **Database**: Use Railway's managed PostgreSQL
4. **HTTPS**: Railway provides SSL certificates automatically
5. **Rate Limiting**: Already configured in the backend

## Next Steps

1. Set up your frontend deployment (Vercel, Netlify, etc.)
2. Configure CORS to allow your frontend domain
3. Set up monitoring and alerts
4. Implement CI/CD pipeline
5. Add comprehensive API documentation

Your database and backend are now ready on Railway! 🚀 