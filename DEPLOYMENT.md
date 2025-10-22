# Financer - Deployment Guide

## Single Server Deployment (Frontend + Backend Together)

This guide explains how to deploy both the Next.js frontend and Express backend on a single server.

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- A server (VPS, AWS EC2, DigitalOcean, etc.)

---

## 🚀 Deployment Steps

### 1. **Configure Environment Variables**

Create a `.env` file in the `server` directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=production

# Email Service (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=Financer <your_email@gmail.com>

# Frontend URL (optional, for CORS)
CLIENT_URL=http://your-domain.com
```

### 2. **Build the Frontend**

Navigate to the client directory and build:

```bash
cd client
npm install
npm run build
```

This will create a static build in `server/public` directory.

### 3. **Install Backend Dependencies**

```bash
cd ../server
npm install
```

### 4. **Start the Server**

```bash
npm start
```

The server will now serve both API endpoints and the frontend at `http://localhost:5000`

---

## 🌐 Hosting Options

### **Option 1: Render.com (Free Tier)**

1. Create account on [Render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all from `.env`
5. Deploy!

### **Option 2: Railway.app**

1. Create account on [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables
4. Configure build:
   - **Build Command**: `npm run build` (from server directory)
   - **Start Command**: `npm start`
5. Deploy!

### **Option 3: Heroku**

1. Install Heroku CLI
2. Create Heroku app:
```bash
heroku create financer-app
```
3. Add MongoDB addon or use MongoDB Atlas
4. Set environment variables:
```bash
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
# ... add all other env vars
```
5. Create `Procfile` in root:
```
web: cd server && npm start
```
6. Deploy:
```bash
git push heroku main
```

### **Option 4: DigitalOcean/AWS/VPS**

1. SSH into your server
2. Install Node.js and MongoDB (or use MongoDB Atlas)
3. Clone your repository
4. Install dependencies and build:
```bash
cd financer/client
npm install
npm run build
cd ../server
npm install
```
5. Use PM2 to run the server:
```bash
npm install -g pm2
pm2 start server.js --name financer
pm2 startup
pm2 save
```
6. Configure Nginx as reverse proxy (optional):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📦 Quick Deploy Script

Create `deploy.sh` in root directory:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Build frontend
echo "📦 Building frontend..."
cd client
npm install
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../server
npm install

# Start server
echo "✅ Starting server..."
npm start
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 Configuration Details

### **How It Works:**

1. **Next.js Configuration** (`client/next.config.ts`):
   - `output: 'export'` - Creates static HTML export
   - `distDir: '../server/public'` - Builds directly into server's public folder
   - `images: { unoptimized: true }` - Disables Next.js image optimization

2. **Express Server** (`server/server.js`):
   - Serves API routes at `/api/*`
   - Serves static files from `public` directory
   - All non-API routes return `index.html` (SPA routing)

3. **API Configuration** (`client/lib/api.ts`):
   - Uses relative URLs when on same origin
   - Falls back to localhost in development

---

## 🔒 Security Considerations

1. **Always use HTTPS in production**
2. **Keep `.env` file secure** - Never commit to Git
3. **Use strong JWT secret**
4. **Enable rate limiting** (install `express-rate-limit`)
5. **Add helmet for security headers** (install `helmet`)

---

## 📊 Monitoring

### Using PM2 (recommended for VPS):

```bash
# View logs
pm2 logs financer

# Monitor
pm2 monit

# Restart
pm2 restart financer

# View status
pm2 status
```

---

## 🐛 Troubleshooting

### **Issue: Frontend not loading**
- Check if `server/public` directory exists and has files
- Verify `npm run build` completed successfully

### **Issue: API calls failing**
- Check if API routes are prefixed with `/api`
- Verify backend server is running
- Check browser console for CORS errors

### **Issue: 404 on refresh**
- Make sure the catch-all route `app.get('*')` is AFTER API routes

### **Issue: Environment variables not working**
- Restart the server after changing `.env`
- Verify `.env` is in the `server` directory

---

## 📝 Notes

- **Port**: Default is 5000, but you can change via `PORT` env variable
- **Database**: Use MongoDB Atlas for production (free tier available)
- **Email**: Gmail App Password required (not regular password)
- **Build Time**: First build may take 2-3 minutes

---

## ✅ Verification

After deployment, test:

1. Visit your domain - should show landing page
2. Sign up a new user - should receive OTP email
3. Login - should redirect to dashboard
4. Create transaction - should work
5. API endpoints - visit `http://your-domain.com/api/users/profile` (should return 401)

---

## 🎉 Success!

Your Financer app is now running on a single server with both frontend and backend combined!

For issues, check server logs:
```bash
# If using PM2
pm2 logs financer

# If running directly
# Check terminal output
```
