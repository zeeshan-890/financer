# Heroku Deployment Guide for Financer

## Prerequisites

1. **Heroku Account**: Sign up at [heroku.com](https://heroku.com)
2. **Heroku CLI**: Install from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
3. **Git**: Ensure your project is a git repository
4. **MongoDB Atlas**: Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Install Heroku CLI

### Windows:
Download and install from: https://devcenter.heroku.com/articles/heroku-cli

### Mac:
```bash
brew tap heroku/brew && brew install heroku
```

### Linux:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

Verify installation:
```bash
heroku --version
```

---

## Step 2: Login to Heroku

```bash
heroku login
```

This will open your browser for authentication.

---

## Step 3: Create Heroku App

```bash
# Navigate to project root
cd financer

# Create Heroku app
heroku create your-app-name

# Or let Heroku generate a random name
heroku create
```

This will:
- Create a new Heroku app
- Add a git remote named `heroku`

Verify remote was added:
```bash
git remote -v
```

You should see:
```
heroku  https://git.heroku.com/your-app-name.git (fetch)
heroku  https://git.heroku.com/your-app-name.git (push)
```

---

## Step 4: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user:
   - Username: `financeruser`
   - Password: (generate a strong password)
4. Whitelist all IPs:
   - Network Access → Add IP Address
   - Use `0.0.0.0/0` to allow all (for Heroku's dynamic IPs)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `financer`

Example:
```
mongodb+srv://financeruser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/financer?retryWrites=true&w=majority
```

---

## Step 5: Configure Environment Variables

Set all required environment variables on Heroku:

```bash
# Database
heroku config:set MONGO_URI="mongodb+srv://financeruser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/financer?retryWrites=true&w=majority"

# JWT Secret (generate a random 32+ character string)
heroku config:set JWT_SECRET="your_super_secret_jwt_key_min_32_characters_long"

# Server
heroku config:set NODE_ENV=production
heroku config:set PORT=5000

# Email Service (Gmail)
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email@gmail.com
heroku config:set SMTP_PASS=your_gmail_app_password
heroku config:set EMAIL_FROM="Financer <your_email@gmail.com>"
```

**For Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use the 16-character password

Verify config vars:
```bash
heroku config
```

---

## Step 6: Add Buildpack (if needed)

The project should auto-detect Node.js, but if not:

```bash
heroku buildpacks:set heroku/nodejs
```

---

## Step 7: Prepare for Deployment

### Option A: Use Current Configuration (Recommended)

The root `package.json` already has the deployment scripts. Heroku will:
1. Run `heroku-postbuild` script
2. Build the Next.js frontend
3. Install server dependencies
4. Start the server (which serves both API and frontend)

### Option B: Manual Build (if needed)

```bash
# Build frontend locally
cd client
npm install
npm run build

# This creates static files in server/public
cd ..
```

---

## Step 8: Deploy to Heroku

### First Deployment:

```bash
# Ensure you're on main/master branch
git branch

# Add and commit all changes
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku
git push heroku main
```

If your branch is named `master`:
```bash
git push heroku master
```

If your branch has a different name:
```bash
git push heroku your-branch-name:main
```

---

## Step 9: Open Your App

```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

---

## Step 10: View Logs

Monitor deployment and runtime logs:

```bash
# View recent logs
heroku logs --tail

# View specific number of lines
heroku logs -n 200

# View only app logs (not system)
heroku logs --source app
```

---

## Troubleshooting

### Issue: Build Fails

**Check build logs:**
```bash
heroku logs --tail
```

**Common fixes:**
- Ensure `package.json` exists in root
- Check Node.js version compatibility
- Verify all dependencies are in `package.json` (not devDependencies)

### Issue: App Crashes on Startup

**Check status:**
```bash
heroku ps
```

**Check logs:**
```bash
heroku logs --tail
```

**Common fixes:**
- Verify all environment variables are set
- Check MongoDB connection string
- Ensure PORT is not hardcoded (use `process.env.PORT`)

### Issue: Database Connection Failed

**Verify MongoDB Atlas:**
- IP whitelist includes `0.0.0.0/0`
- Database user exists with correct password
- Connection string format is correct

**Test connection string:**
```bash
heroku config:get MONGO_URI
```

### Issue: Email Not Working

**Verify email config:**
```bash
heroku config | grep SMTP
```

**Check Gmail settings:**
- 2-Step Verification enabled
- App Password generated (not regular password)
- Less secure apps access (if using regular password)

---

## Updating Your Deployment

After making changes:

```bash
# Add and commit changes
git add .
git commit -m "Your commit message"

# Push to Heroku
git push heroku main

# View logs
heroku logs --tail
```

---

## Scaling

### View current dynos:
```bash
heroku ps
```

### Scale up (if needed):
```bash
# Increase to 2 dynos
heroku ps:scale web=2

# Scale back to 1 (free tier)
heroku ps:scale web=1
```

**Note:** Free tier allows only 1 dyno.

---

## Using a Custom Domain

### Add domain:
```bash
heroku domains:add www.yourdomain.com
```

### Get DNS target:
```bash
heroku domains
```

### Configure DNS:
Add CNAME record in your domain registrar:
```
CNAME: www → your-app-name.herokudns.com
```

---

## Environment-Specific Configurations

### Development:
```bash
# Local .env file
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/financer
```

### Production (Heroku):
```bash
# Set via heroku config:set
NODE_ENV=production
PORT=5000 (Heroku sets this automatically)
MONGO_URI=mongodb+srv://...
```

---

## Heroku Commands Cheat Sheet

```bash
# App Info
heroku apps:info                 # Show app info
heroku config                    # List all config vars
heroku ps                        # Show dyno status

# Logs
heroku logs --tail              # Stream logs
heroku logs -n 500              # Show last 500 lines

# Database
heroku addons                   # List addons
heroku run bash                 # Open bash in dyno

# Deployment
git push heroku main            # Deploy
heroku releases                 # Show deployment history
heroku rollback                 # Rollback to previous release

# Restart
heroku restart                  # Restart all dynos

# Delete app
heroku apps:destroy --app your-app-name
```

---

## Cost

**Free Tier Includes:**
- 550-1000 free dyno hours/month
- Apps sleep after 30 min of inactivity
- Apps wake up when accessed (few seconds delay)

**Upgrade to Hobby ($7/month) for:**
- No sleeping
- Custom SSL
- Always-on

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT_SECRET** (32+ characters)
3. **Rotate secrets regularly**
4. **Use MongoDB Atlas with IP whitelist**
5. **Enable 2FA on Heroku account**
6. **Use HTTPS only** (Heroku provides free SSL)

---

## Continuous Deployment (Optional)

### Connect to GitHub:

1. Go to Heroku Dashboard
2. Select your app
3. Go to "Deploy" tab
4. Connect to GitHub repository
5. Enable "Automatic Deploys" from main branch

Now every push to GitHub will auto-deploy to Heroku!

---

## Monitoring

### Enable logging:
```bash
heroku logs --tail
```

### View metrics (requires addon):
```bash
heroku addons:create papertrail
```

---

## Backup & Restore

### MongoDB Atlas Backup:
- Atlas provides automatic backups
- Configure in Atlas dashboard

### Heroku Releases:
```bash
# View releases
heroku releases

# Rollback to previous
heroku rollback v123
```

---

## Support

- **Heroku Docs**: https://devcenter.heroku.com
- **Heroku Status**: https://status.heroku.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

## Quick Deploy Script

Create `deploy-heroku.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying to Heroku..."

# Add and commit changes
git add .
git commit -m "Deploy to Heroku"

# Push to Heroku
git push heroku main

# Show logs
echo "📊 Showing logs..."
heroku logs --tail
```

Make executable:
```bash
chmod +x deploy-heroku.sh
./deploy-heroku.sh
```

---

## Success Checklist

- [ ] Heroku CLI installed
- [ ] Heroku app created
- [ ] MongoDB Atlas cluster created
- [ ] All environment variables set
- [ ] Code committed to git
- [ ] Deployed to Heroku (`git push heroku main`)
- [ ] App accessible at Heroku URL
- [ ] Can register and login
- [ ] Can create transactions
- [ ] Emails working (OTP, notifications)

---

**🎉 Your Financer app is now live on Heroku!**

Visit: `https://your-app-name.herokuapp.com`
