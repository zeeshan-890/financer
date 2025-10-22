# 🚀 Quick Start Guide - Financer

## What You Have

A complete full-stack finance management application with:

### ✅ Backend (Express + MongoDB)
- ✅ Authentication system (JWT)
- ✅ User management
- ✅ Group & transaction management
- ✅ Savings goals tracking
- ✅ Email reminder service
- ✅ Automated cron jobs

### ✅ Frontend (Next.js + TypeScript)
- ✅ Landing page
- ✅ Login/Signup pages
- ✅ Dashboard with charts
- ✅ Groups management
- ✅ Transactions tracking
- ✅ Goals tracking with progress bars
- ✅ Settings page
- ✅ Responsive design

## 🏃‍♂️ Running the App

### Step 1: Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas connection string.

### Step 2: Start the Backend

Open **Terminal 1**:
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financer
JWT_SECRET=my_super_secret_key_12345
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_user
SMTP_PASS=your_ethereal_password
EMAIL_FROM=Financer <noreply@financer.app>
```

Run:
```bash
npm run dev
```

✅ Backend runs on: http://localhost:5000

### Step 3: Start the Frontend

Open **Terminal 2**:
```bash
cd client
npm install --legacy-peer-deps
```

Already created: `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run:
```bash
npm run dev
```

✅ Frontend runs on: http://localhost:3000

## 🎯 Testing the App

1. **Visit**: http://localhost:3000
2. **Click**: "Get Started" or "Sign Up"
3. **Create an account**:
   - Name: John Doe
   - Email: john@example.com
   - Password: test123

4. **Explore features**:
   - Dashboard - See mock charts and statistics
   - Groups - Create groups and manage expenses
   - Transactions - View transaction history
   - Goals - Set and track savings goals
   - Settings - Update preferences

## 📝 Current Status

### Working Features ✅
- User registration and login
- JWT authentication
- Protected routes
- Dashboard with Recharts visualizations
- Responsive UI with Tailwind CSS
- All pages created and functional
- Backend API ready

### Next Steps for Full Integration 🔧

The UI is complete but uses **mock data**. To integrate with real backend:

1. **Dashboard**: Fetch real user data
```typescript
// In dashboard/page.tsx, replace mock data with:
const { data } = await api.get('/users/' + user.id);
const transactions = await transactionApi.getAll();
```

2. **Groups**: Connect to API
```typescript
// In groups/page.tsx
const { data } = await groupApi.getAll();
```

3. **Transactions**: Fetch from backend
```typescript
// In transactions/page.tsx
const { data } = await transactionApi.getAll();
```

4. **Goals**: Real goal tracking
```typescript
// In goals/page.tsx
const { data } = await goalApi.getGoals(user.id);
```

## 🔑 Key Files

### Backend
- `server/server.js` - Main entry point
- `server/models/` - Database schemas
- `server/controllers/` - Business logic
- `server/routes/` - API endpoints

### Frontend
- `client/app/` - All pages
- `client/components/` - Reusable components
- `client/lib/api.ts` - API client
- `client/store/authStore.ts` - Auth state

## 🎨 Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16 |
| UI Styling | Tailwind CSS |
| State Management | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| Backend Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer |
| Scheduler | node-cron |

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists in `server/`
- Run `npm install` in server directory

### Frontend won't start
- Run `npm install --legacy-peer-deps` in client/
- Check `.env.local` exists
- Clear `.next` folder and rebuild

### Can't login
- Check backend is running on port 5000
- Open browser console for errors
- Verify CORS is enabled in backend

### Charts not showing
- Dependencies installed correctly?
- Check browser console for errors

## 📧 Email Configuration

For testing emails without real SMTP:
1. Visit https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy credentials to `server/.env`
4. View sent emails at ethereal.email inbox

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas for production
- [ ] Configure real SMTP (Gmail, SendGrid, etc.)
- [ ] Set NEXT_PUBLIC_API_URL to production backend
- [ ] Enable CORS for production frontend domain
- [ ] Add error tracking (Sentry)
- [ ] Set up CI/CD pipeline

### Deploy Backend (Render)
1. Connect GitHub repo
2. Select `server` as root directory
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

### Deploy Frontend (Vercel)
1. Import project from GitHub
2. Root directory: `client`
3. Framework: Next.js
4. Add environment variable: `NEXT_PUBLIC_API_URL`

## 💡 Tips

- Use `.gitignore` to exclude `.env` files
- Keep dependencies updated
- Test on mobile devices
- Monitor API performance
- Back up database regularly

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**You're all set! Happy coding! 🎉**
