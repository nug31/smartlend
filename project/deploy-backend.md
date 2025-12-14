# Backend Deployment to Heroku

## Prerequisites
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login to Heroku: `heroku login`

## Deployment Steps

### 1. Create Heroku App
```bash
cd backend
heroku create loan-management-backend-nug
```

### 2. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini -a loan-management-backend-nug
```

### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production -a loan-management-backend-nug
```

### 4. Deploy Backend
```bash
# Initialize git in backend folder
git init
git add .
git commit -m "Initial backend deployment"

# Add Heroku remote
heroku git:remote -a loan-management-backend-nug

# Deploy
git push heroku main
```

### 5. Check Deployment
```bash
heroku logs --tail -a loan-management-backend-nug
heroku open -a loan-management-backend-nug
```

## Alternative: Deploy from Main Repository

If you want to deploy backend from the main repository:

```bash
# From project root
git subtree push --prefix=backend heroku main
```

## Environment Variables Needed

The following environment variables will be automatically set by Heroku:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Application port

## Testing Backend

After deployment, test these endpoints:
- `https://loan-management-backend-nug.herokuapp.com/health`
- `https://loan-management-backend-nug.herokuapp.com/api/dashboard/stats`

## Update Frontend

After backend is deployed, update Netlify environment variables:
```
VITE_API_BASE_URL=https://loan-management-backend-nug.herokuapp.com/api
```
