# Deployment Guide for BookSwap Frontend

## Vercel Deployment Steps

### 1. **Pre-deployment Checklist**
- ✅ `vercel.json` configured for SPA routing
- ✅ `vite.config.js` base path set to `/`
- ✅ Environment variables configured
- ✅ API URLs updated for production

### 2. **Deploy to Vercel**

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the client/book_swap directory
cd client/book_swap
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your username)
# - Link to existing project? N
# - What's your project's name? book-swap-frontend
# - In which directory is your code located? ./
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `client/book_swap` folder as the root directory
4. Vercel will auto-detect it's a Vite project
5. Deploy!

### 3. **Environment Variables**
In your Vercel dashboard, add these environment variables:

```
VITE_API_URL=https://your-backend-api-url.com/api
```

### 4. **Common Issues & Solutions**

#### 404 Errors on Page Refresh
✅ **Fixed**: The `vercel.json` file redirects all routes to `index.html`

#### Static Assets Not Loading
✅ **Fixed**: Proper routing rules for static files in `vercel.json`

#### API Connection Issues
- Make sure `VITE_API_URL` environment variable is set in Vercel
- Ensure your backend is deployed and accessible
- Check CORS settings on your backend

### 5. **Build Commands**
Vercel will automatically use:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 6. **Domain Configuration**
After deployment, you can:
- Use the auto-generated Vercel domain: `book-swap-frontend.vercel.app`
- Add a custom domain in Vercel dashboard

### 7. **Backend Deployment**
Don't forget to deploy your NestJS backend:
- Deploy to Vercel, Railway, or Heroku
- Update the `VITE_API_URL` environment variable with the backend URL
- Ensure MongoDB connection is properly configured

## File Structure for Deployment
```
client/book_swap/
├── dist/                 # Build output (generated)
├── public/
│   ├── _redirects       # Fallback redirects
│   └── vite.svg
├── src/
├── vercel.json          # Vercel configuration
├── vite.config.js       # Vite configuration
├── package.json
└── .env.example         # Environment template
```