<p align="center">
  <h1 align="center">💰 Financer</h1>
  <p align="center">
    <strong>Complete Personal & Group Finance Management Platform</strong>
  </p>
  <p align="center">
    Track expenses • Split bills • Set goals • Get reminders • Manage budgets
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---
**Demo video :** https://drive.google.com/file/d/1mSBeeYdNPLHPg7rEoVgTLOE4FtOnLxDi/view?usp=drive_link

**Deployed Website  :** https://financerzeeshanabbas-512be7f5802e.herokuapp.com/

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#️-database-schema)
- [Email System](#-email-system)
- [Deployment](#-deployment)
- [Configuration](#️-configuration)
- [Security](#-security)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 About

**Financer** is a comprehensive finance management web application designed to help individuals and groups manage their finances effectively. Whether you're tracking personal expenses, splitting bills with friends, or saving for goals, Financer provides all the tools you need in one place.

### Key Highlights

✨ **Personal Finance Management** - Track income, expenses, and savings with detailed analytics  
👥 **Group Expense Splitting** - Split bills equally or custom amounts with friends  
📧 **Automated Email Reminders** - Never forget payments with scheduled email notifications  
🔐 **Email OTP Verification** - Secure authentication with one-time password verification  
📊 **Visual Analytics** - Beautiful charts and graphs for spending insights  
🎯 **Goal Tracking** - Set and monitor savings goals with progress visualization  
💱 **Multi-Currency Support** - Handle multiple currencies (INR, USD, EUR, GBP)  
🌙 **Dark Mode Ready** - Full dark mode support for comfortable viewing  

---

## 🚀 Features

### 🔐 Authentication & Security
- **Email/Password Registration** with secure password hashing (bcrypt)
- **OTP Email Verification** - 6-digit code with 10-minute expiry
- **JWT Authentication** - Secure token-based sessions (7-day expiry)
- **Password Protection** - Industry-standard encryption
- **Auto Logout** - Persistent auth with Zustand + localStorage

### 💳 Personal Finance
- **Transaction Management**
  - Add income/expense with categories
  - Date-based tracking
  - Notes and descriptions
  - Filter by type, category, date range
  - Search functionality
- **Dashboard Analytics**
  - Current balance overview
  - Monthly expense/income summary
  - Spending by category (pie chart)
  - Monthly trends (bar chart)
  - Quick stats cards
- **Budget Management**
  - Set monthly budget limits
  - Track budget utilization
  - Overspending alerts
  - Income vs expense comparison

### 👥 Group Finance & Bill Splitting
- **Friends Management**
  - Add friends with email/name/phone
  - Store additional info (university, hostel, batch, address)
  - Search and filter friends
  - Remove friends
- **Group Expenses**
  - Create group expenses with custom titles
  - **Equal Split** - Automatically divide among all members
  - **Custom Split** - Assign specific amounts to each person
  - Track who paid upfront
  - Monitor pending/paid status
  - Visual payment status indicators
- **Payment Tracking**
  - Mark individual payments as paid
  - Track payment dates
  - Calculate amounts to receive
  - Split history for each expense

### 📧 Email Notification System
- **OTP Verification Emails**
  - Beautiful HTML templates
  - Clear OTP display
  - Expiry time indication
- **Expense Notification Emails**
  - Sent immediately when expense is created
  - Shows expense name, total amount, friend's share
  - Includes who paid upfront
  - Professional gradient design
- **Payment Reminder Emails**
  - Automated cron job (daily at 9:00 AM)
  - Resends every 3 days for unpaid amounts
  - Shows amount due and payee details
  - Urgent styling for pending payments

### 🎯 Savings Goals
- **Goal Creation**
  - Set target amounts
  - Define deadlines
  - Track progress with visual bars
- **Contributions**
  - Add funds to goals
  - View contribution history
  - Calculate remaining amount
- **Goal Status**
  - Active/Completed/Failed status
  - Deadline tracking
  - Achievement notifications

### 📊 Analytics & Insights
- **Spending by Category** - Interactive pie charts
- **Monthly Trends** - Bar charts showing expense patterns
- **Balance Overview** - Real-time balance calculation
- **Category Breakdown** - Detailed spending analysis
- **Date Range Filters** - Custom period analysis

### ⚙️ Settings & Preferences
- **Profile Management** - Update name, email, currency
- **Currency Selection** - INR, USD, EUR, GBP support
- **Budget Configuration** - Set monthly spending limits
- **Income Tracking** - Record monthly income
- **Theme Support** - Dark/Light mode ready

---

## 🛠️ Tech Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.0 | React framework with SSR/SSG |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Zustand** | 5.0.2 | State management with persistence |
| **Axios** | 1.6.2 | HTTP client for API calls |
| **Recharts** | 2.15.0 | Charting library |
| **Lucide React** | 0.468.0 | Icon library |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **date-fns** | 4.1.0 | Date manipulation |
| **clsx** | 2.1.1 | Conditional classNames |
| **CVA** | 0.7.1 | Class Variance Authority |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 8.0.3 | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Nodemailer** | 7.0.9 | Email sending |
| **Node Cron** | 3.0.3 | Task scheduling |
| **Joi** | 17.11.0 | Request validation |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Morgan** | 1.10.0 | HTTP request logger |
| **Dotenv** | 16.3.1 | Environment variables |

### Development Tools

- **ESLint** - Code linting
- **Nodemon** - Auto server restart
- **PostCSS** - CSS processing

---

## 📁 Project Structure

```
financer/
│
├── client/                          # Next.js Frontend Application
│   ├── app/                        # App Router (Next.js 13+)
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles
│   │   ├── dashboard/             # Dashboard page
│   │   │   └── page.tsx
│   │   ├── transactions/          # Transactions page
│   │   │   └── page.tsx
│   │   ├── groups/                # Group expenses page
│   │   │   └── page.tsx
│   │   ├── goals/                 # Savings goals page
│   │   │   └── page.tsx
│   │   ├── settings/              # Settings page
│   │   │   └── page.tsx
│   │   ├── login/                 # Login page
│   │   │   └── page.tsx
│   │   ├── signup/                # Signup page
│   │   │   └── page.tsx
│   │   └── verify-otp/            # OTP verification page
│   │       └── page.tsx
│   │
│   ├── components/                # React Components
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── AddTransactionModal.tsx
│   │   ├── AddGroupExpenseModal.tsx
│   │   └── ui/                   # UI Components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   │
│   ├── lib/                       # Utilities & Helpers
│   │   ├── api.ts                # Axios API client
│   │   └── utils.ts              # Utility functions
│   │
│   ├── store/                     # State Management
│   │   └── authStore.ts          # Auth store (Zustand)
│   │
│   ├── public/                    # Static assets
│   ├── next.config.ts            # Next.js configuration
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── tsconfig.json             # TypeScript config
│   ├── package.json              # Dependencies
│   └── README.md                 # Frontend docs
│
├── server/                         # Express Backend Application
│   ├── config/                    # Configuration
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controllers/               # Route Controllers
│   │   ├── authController.js     # Auth logic (register, login, OTP)
│   │   ├── userController.js     # User operations
│   │   ├── transactionController.js # Transaction CRUD
│   │   ├── groupController.js    # Group management
│   │   ├── goalController.js     # Goals CRUD
│   │   └── reminderController.js # Reminder operations
│   │
│   ├── models/                    # Database Models (Mongoose)
│   │   ├── User.js               # User schema
│   │   ├── Transaction.js        # Transaction schema
│   │   ├── Group.js              # Group schema
│   │   ├── Goal.js               # Goal schema
│   │   ├── Reminder.js           # Reminder schema
│   │   └── Notification.js       # Notification schema
│   │
│   ├── routes/                    # API Routes
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── userRoutes.js         # /api/users/*
│   │   ├── transactionRoutes.js  # /api/transactions/*
│   │   ├── groupRoutes.js        # /api/groups/*
│   │   ├── goalRoutes.js         # /api/goals/*
│   │   └── reminderRoutes.js     # /api/reminders/*
│   │
│   ├── middlewares/               # Express Middlewares
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── logger.js             # Request logger
│   │   └── validateRequest.js    # Joi validation
│   │
│   ├── services/                  # Business Logic Services
│   │   ├── emailService.js       # Nodemailer (OTP, notifications)
│   │   └── cronService.js        # Scheduled tasks (reminders)
│   │
│   ├── utils/                     # Utility Functions
│   │   ├── token.js              # JWT generation/validation
│   │   └── validators.js         # Joi schemas
│   │
│   ├── public/                    # Static files (for deployment)
│   ├── server.js                 # Main server file
│   ├── package.json              # Dependencies
│   ├── .env                      # Environment variables (gitignored)
│   ├── .env.example              # Example env file
│   └── README.md                 # Backend docs
│
├── deploy.sh                      # Linux/Mac deployment script
├── deploy.bat                     # Windows deployment script
├── DEPLOYMENT.md                  # Deployment guide
├── QUICKSTART.md                  # Quick start guide
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Local installation](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Gmail Account** - For SMTP email service (or any other SMTP provider)
- **Git** - For version control

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/financer.git
cd financer
```

#### 2️⃣ Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create environment variables file:

```bash
# Copy the example file
cp .env.example .env

# Or create manually
touch .env
```

Configure your `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/financer
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/financer?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d

# Email Service (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=Financer <your_email@gmail.com>

# Optional
CLIENT_URL=http://localhost:3000
```

**📧 Gmail App Password Setup:**

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll to **App Passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password to `SMTP_PASS`

Start the backend server:

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

Server will start at: `

✅ You should see:
```
Server running on port 5000
✅ MongoDB connected successfully
✅ Email server is ready to send messages
```

#### 3️⃣ Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Create environment variables file:

```bash
# Create .env.local file
touch .env.local
```

Configure your `.env.local` file:

```env
# API URL - Backend server
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will start at: `http://localhost:3000`

✅ You should see:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

#### 4️⃣ Verify Installation

1. Open your browser and go to `http://localhost:3000`
2. You should see the Financer landing page
3. Click **Get Started** to create an account
4. Register with your email
5. Check your email for OTP verification code
6. Verify OTP and start using the app!

---

### Quick Start Commands

```bash
# Clone repository
git clone https://github.com/yourusername/financer.git
cd financer

# Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend setup (in new terminal)
cd client
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev

# Access application
# Open http://localhost:3000 in browser
```

---

### Running Both Servers

**Option 1: Separate Terminals** (Recommended for development)

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

**Option 2: Using Concurrently** (Install `concurrently` package)

```bash
# From root directory
npm install -g concurrently

# Run both
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

**Option 3: Single Server Deployment** (For production)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting frontend and backend together.

---

### Database Setup

#### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

3. Use connection string: `mongodb://localhost:27017/financer`

#### MongoDB Atlas (Cloud - Recommended)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0)
3. Add database user with password
4. Whitelist your IP (or use `0.0.0.0/0` for all)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/financer?retryWrites=true&w=majority
   ```
6. Add to `.env` as `MONGO_URI`

---

### First Time Setup Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend `.env` file configured
- [ ] Frontend `.env.local` file configured
- [ ] Gmail app password generated (if using Gmail)
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access landing page
- [ ] Can register and receive OTP email
- [ ] Can login and access dashboard

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

#### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/verify-otp` | Verify email OTP | ❌ |
| POST | `/auth/resend-otp` | Resend OTP code | ❌ |

**Register User:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "user": { "id": "...", "name": "...", "email": "...", "isVerified": false },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Registration successful! Please verify your email."
}
```

**Login User:**
```bash
POST /api/auth/login

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "user": { "id": "...", "name": "...", "email": "...", "isVerified": true },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Verify OTP:**
```bash
POST /api/auth/verify-otp

{
  "email": "john@example.com",
  "otp": "123456"
}

Response:
{
  "message": "Email verified successfully!",
  "user": { "id": "...", "isVerified": true }
}
```

---

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user | ✅ |
| PUT | `/users/profile` | Update profile | ✅ |
| GET | `/users/friends` | Get friends list | ✅ |
| POST | `/users/friends` | Add friend | ✅ |
| DELETE | `/users/friends/:id` | Remove friend | ✅ |
| GET | `/users/search?query=` | Search users | ✅ |

**Update Profile:**
```bash
PUT /api/users/profile
Authorization: Bearer <token>

{
  "name": "John Updated",
  "currency": "USD",
  "monthlyBudget": 50000,
  "income": 75000
}
```

**Add Friend:**
```bash
POST /api/users/friends

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "university": "MIT",
  "userId": "optional_user_id"
}
```

---

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/transactions` | Create transaction | ✅ |
| GET | `/transactions` | Get all transactions | ✅ |
| GET | `/transactions/stats` | Get statistics | ✅ |
| DELETE | `/transactions/:id` | Delete transaction | ✅ |
| PATCH | `/transactions/:id/payment-status` | Update payment | ✅ |

**Create Transaction (Personal):**
```bash
POST /api/transactions

{
  "title": "Grocery Shopping",
  "amount": 1500,
  "type": "expense",
  "category": "Food",
  "date": "2025-10-22",
  "notes": "Weekly groceries"
}
```

**Create Group Expense:**
```bash
POST /api/transactions

{
  "title": "Team Dinner",
  "amount": 3000,
  "type": "expense",
  "category": "Food",
  "isGroupExpense": true,
  "splitBetween": [
    {
      "userId": "user123",
      "name": "Jane",
      "email": "jane@example.com",
      "amountOwed": 1000,
      "status": "pending"
    },
    {
      "name": "Bob",
      "email": "bob@example.com",
      "amountOwed": 1000,
      "status": "pending"
    }
  ],
  "notes": "Friday team outing"
}
```

**Get Transactions with Filters:**
```bash
GET /api/transactions?type=expense&category=Food&startDate=2025-10-01&endDate=2025-10-31
```

**Update Payment Status:**
```bash
PATCH /api/transactions/:transactionId/payment-status

{
  "userId": "user123",
  "status": "paid"
}
```

---

### Goal Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/goals` | Create goal | ✅ |
| GET | `/goals` | Get all goals | ✅ |
| PATCH | `/goals/:id` | Update goal | ✅ |
| PATCH | `/goals/:id/add-funds` | Add funds to goal | ✅ |
| DELETE | `/goals/:id` | Delete goal | ✅ |

**Create Goal:**
```bash
POST /api/goals

{
  "title": "New Laptop",
  "targetAmount": 80000,
  "deadline": "2025-12-31",
  "category": "Electronics"
}
```

**Add Funds:**
```bash
PATCH /api/goals/:goalId/add-funds

{
  "amount": 5000,
  "note": "Monthly savings"
}
```

---

### Group Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/groups` | Create group | ✅ |
| GET | `/groups` | Get all groups | ✅ |
| GET | `/groups/:id` | Get group details | ✅ |
| POST | `/groups/:id/members` | Add member | ✅ |
| DELETE | `/groups/:id/members/:memberId` | Remove member | ✅ |

---

### Reminder Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reminders/send` | Send reminder emails | ✅ |
| GET | `/reminders` | Get all reminders | ✅ |

---

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  currency: String (default: 'INR'),
  monthlyBudget: Number,
  income: Number,
  isVerified: Boolean (default: false),
  verificationOTP: String,
  otpExpiry: Date,
  friends: [{
    userId: ObjectId,
    name: String,
    email: String,
    phone: String,
    university: String,
    batch: String,
    hostel: String,
    address: String,
    notes: String,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model

```javascript
{
  userId: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  type: String (enum: ['income', 'expense'], required),
  category: String (required),
  date: Date (default: now),
  notes: String,
  isGroupExpense: Boolean (default: false),
  groupId: ObjectId (ref: Group),
  splitBetween: [{
    userId: ObjectId (ref: User),
    name: String,
    email: String,
    amountOwed: Number,
    status: String (enum: ['pending', 'paid']),
    paidAt: Date,
    _id: ObjectId
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Goal Model

```javascript
{
  userId: ObjectId (ref: User, required),
  title: String (required),
  targetAmount: Number (required),
  savedAmount: Number (default: 0),
  deadline: Date,
  status: String (enum: ['active', 'completed', 'failed'], default: 'active'),
  category: String,
  contributions: [{
    amount: Number,
    note: String,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder Model

```javascript
{
  type: String (enum: ['payment', 'goal', 'budget'], required),
  transactionId: ObjectId (ref: Transaction),
  goalId: ObjectId (ref: Goal),
  toUser: ObjectId (ref: User, required),
  fromUser: ObjectId (ref: User),
  amount: Number,
  message: String,
  active: Boolean (default: true),
  sent: Boolean (default: false),
  lastSentAt: Date,
  paymentReceived: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Group Model

```javascript
{
  name: String (required),
  createdBy: ObjectId (ref: User, required),
  members: [{
    userId: ObjectId (ref: User),
    name: String,
    email: String,
    role: String (enum: ['admin', 'member'])
  }],
  totalExpenses: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model

```javascript
{
  userId: ObjectId (ref: User, required),
  type: String (enum: ['payment', 'reminder', 'goal', 'system']),
  title: String,
  message: String,
  read: Boolean (default: false),
  relatedId: ObjectId,
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

### Registration & Email Verification

```mermaid
sequenceDiagram
    User->>Frontend: Fill registration form
    Frontend->>Backend: POST /auth/register
    Backend->>Database: Create user (isVerified: false)
    Backend->>Email Service: Send OTP email
    Backend->>Frontend: Return user + token
    Frontend->>User: Redirect to OTP verification
    User->>Frontend: Enter 6-digit OTP
    Frontend->>Backend: POST /auth/verify-otp
    Backend->>Database: Verify OTP & mark user verified
    Backend->>Frontend: Success response
    Frontend->>User: Redirect to dashboard
```

**Key Points:**
- Password is hashed using bcrypt (10 salt rounds)
- 6-digit OTP generated randomly
- OTP expires in 10 minutes
- User can resend OTP if expired
- JWT token issued immediately (7-day expiry)
- Token stored in localStorage with Zustand persistence

### Login Flow

```
1. User enters email/password
2. Backend verifies credentials (bcrypt.compare)
3. Check if user.isVerified === true
4. If not verified:
   - Generate new OTP
   - Send email
   - Return message to verify
5. If verified:
   - Generate JWT token
   - Return user + token
6. Frontend stores token
7. Redirect to dashboard
```

### Protected Routes

All API requests include JWT token:
```javascript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

Middleware verifies token on every protected route.

---

## 📧 Email System

### Email Service Configuration

Using **Nodemailer** with Gmail SMTP:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password
  }
});
```

### Email Types

#### 1. OTP Verification Email

**Trigger:** User registration  
**Template:** Purple gradient design with large OTP display  
**Contains:**
- 6-digit OTP code (36px font)
- User's name
- 10-minute expiry notice
- Professional gradient header

**Sample:**
```
Subject: Verify Your Email - Financer

Hi John,

Your verification code is:

  1 2 3 4 5 6

This code expires in 10 minutes.
```

#### 2. Expense Notification Email

**Trigger:** Group expense created (sent immediately)  
**Template:** Blue/purple gradient design  
**Sent to:** All friends in split  
**Contains:**
- Expense name and category
- Total amount
- Friend's share amount (highlighted)
- Who paid upfront
- Professional table layout

**Sample:**
```
Subject: New Expense Added - Team Dinner

Hi Jane,

Bob just added a new expense:

Expense: Team Dinner
Total Amount: ₹3,000
Your Share: ₹1,000 (highlighted)

Paid By: Bob

Please settle up at your earliest convenience.
```

#### 3. Payment Reminder Email

**Trigger:** Cron job (daily 9:00 AM) + 3-day intervals  
**Template:** Orange/red gradient design (urgent style)  
**Contains:**
- Amount due (large, prominent)
- Who to pay
- Expense details
- Urgent styling with red borders

**Sample:**
```
Subject: Payment Reminder - You owe ₹1,000

Hi Jane,

This is a friendly reminder:

You owe: ₹1,000

To Pay: Bob

Please complete the payment soon.
```

### Cron Job Schedule

**Schedule:** Daily at 9:00 AM  
**Query Logic:**
```javascript
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

Reminder.find({
  active: true,
  paymentReceived: false,
  $or: [
    { sent: false }, // Never sent
    { lastSentAt: { $lte: threeDaysAgo } } // Sent > 3 days ago
  ]
});
```

**Process:**
1. Find all pending reminders
2. Send email to each user
3. Update `sent: true` and `lastSentAt: Date.now()`
4. Log success/failure

---

## 🎨 UI Components

### Custom Component Library

Built following **shadcn/ui** patterns with Tailwind CSS and CVA (Class Variance Authority).

#### Button Component

```typescript
<Button variant="default" size="md">
  Click Me
</Button>
```

**Variants:**
- `default` - Primary blue background
- `destructive` - Red for delete actions
- `outline` - Border only
- `ghost` - Transparent background
- `link` - Text link style

**Sizes:** `sm`, `md`, `lg`, `icon`

#### Card Component

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

#### Input & Label

```typescript
<div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="john@example.com"
  />
</div>
```

#### Navigation Bar

```typescript
<Navbar />
```

**Features:**
- Responsive design
- Active route highlighting
- User profile dropdown (planned)
- Mobile menu toggle (planned)

---

## 📊 Analytics & Charts

### Dashboard Charts

Using **Recharts** library for data visualization.

#### 1. Spending by Category (Pie Chart)

```typescript
<PieChart width={400} height={300}>
  <Pie
    data={categoryData}
    dataKey="value"
    nameKey="name"
    fill="#8884d8"
  />
  <Tooltip />
  <Legend />
</PieChart>
```

**Data Source:** Aggregated from transactions by category

#### 2. Monthly Trends (Bar Chart)

```typescript
<BarChart width={600} height={300} data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="income" fill="#10b981" />
  <Bar dataKey="expense" fill="#ef4444" />
</BarChart>
```

**Data Source:** Monthly aggregated transactions

#### 3. Goal Progress Bars

```typescript
<div className="w-full bg-gray-200 rounded-full h-4">
  <div
    className="bg-blue-600 h-4 rounded-full"
    style={{ width: `${(savedAmount / targetAmount) * 100}%` }}
  />
</div>
```

### Statistics Calculations

```javascript
// Current Balance
const balance = totalIncome - totalExpenses;

// Monthly Expense
const monthlyExpense = transactions
  .filter(t => t.type === 'expense' && isCurrentMonth(t.date))
  .reduce((sum, t) => sum + t.amount, 0);

// Budget Utilization
const budgetUsed = (monthlyExpense / monthlyBudget) * 100;

// Spending by Category
const categoryTotals = transactions.reduce((acc, t) => {
  acc[t.category] = (acc[t.category] || 0) + t.amount;
  return acc;
}, {});
```

---

## 🚀 Deployment

### Deployment Options

Financer can be deployed in two ways:

1. **Separate Deployment** - Frontend and backend on different platforms
2. **Single Server** - Both on same server (recommended for simplicity)

For detailed deployment guide, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

### Option 1: Single Server Deployment (Recommended)

Deploy both frontend and backend together on one server.

**Quick Deploy:**

```bash
# Build frontend into server/public
cd client
npm run build

# Start backend (serves both API and frontend)
cd ../server
npm start
```

Or use the deploy script:

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

**Hosting Platforms:**
- **Render.com** (Free tier available)
- **Railway.app** (Free tier available)
- **Heroku** (Paid)
- **DigitalOcean** ($5/month VPS)
- **AWS EC2** (Free tier 1 year)

---

### Option 2: Separate Deployment

#### Frontend - Vercel

```bash
cd client

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
# NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

#### Backend - Render.com

1. Create account on [Render.com](https://render.com)
2. New **Web Service** → Connect GitHub repo
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables from `.env`
5. Deploy!

#### Database - MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Add to backend environment variables

---

### Environment Variables for Production

#### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/financer
JWT_SECRET=your_production_secret_min_32_chars
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Financer <your_email@gmail.com>
CLIENT_URL=https://your-frontend-url.com
```

#### Frontend (.env.local or Vercel Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

### Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database connection string obtained
- [ ] Gmail app password generated
- [ ] Backend environment variables set
- [ ] Frontend API URL configured
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Can register and receive OTP email
- [ ] Can create transactions
- [ ] Can create group expenses
- [ ] Email notifications working

---

## ⚙️ Configuration

### Frontend Configuration

**next.config.ts:**

```typescript
const nextConfig = {
  // For separate deployment
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // For single server deployment
  output: 'export',
  distDir: '../server/public',
  images: {
    unoptimized: true,
  },
};
```

**tailwind.config.ts:**

```typescript
module.exports = {
  darkMode: 'class', // Enable dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
};
```

### Backend Configuration

**server.js:**

```javascript
// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Serve static files (for single server deployment)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

---

## 🔒 Security

### Security Best Practices Implemented

✅ **Password Security**
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Minimum length requirement (frontend validation)

✅ **JWT Authentication**
- Secure token generation with HS256 algorithm
- 7-day expiration
- Signed with strong secret key (min 32 characters)
- Token validated on every protected route

✅ **Email Verification**
- OTP required for account activation
- 10-minute OTP expiry
- One-time use codes
- Stored securely in database

✅ **API Security**
- CORS configured for specific origins
- Request validation with Joi schemas
- Error messages don't leak sensitive info
- Rate limiting recommended (see below)

✅ **Database Security**
- MongoDB connection with authentication
- Mongoose schema validation
- Protected against injection attacks
- Indexes on frequently queried fields

### Additional Security Recommendations

**1. Add Rate Limiting:**

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**2. Add Helmet for Security Headers:**

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

**3. Environment Variables Security:**
- Never commit `.env` to Git
- Use different secrets for dev/prod
- Rotate JWT secrets periodically
- Use environment-specific configurations

**4. HTTPS in Production:**
- Always use HTTPS (SSL/TLS)
- Most hosting platforms provide free SSL
- Redirect HTTP to HTTPS

**5. Input Validation:**
- Validate all user inputs (already using Joi)
- Sanitize data before database operations
- Use parameterized queries (Mongoose handles this)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/financer.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add some AmazingFeature"
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for code review

### Coding Standards

- **JavaScript/TypeScript:** Use ES6+ syntax
- **React:** Functional components with hooks
- **Naming:** camelCase for variables, PascalCase for components
- **Formatting:** Consistent indentation (2 spaces)
- **Comments:** Explain "why" not "what"

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Localization/i18n
- ♿ Accessibility improvements

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Backend won't start

**Error:** `MONGO_URI is not defined`

**Solution:**
```bash
# Ensure .env file exists in server directory
cd server
cat .env # Linux/Mac
type .env # Windows

# Verify MONGO_URI is set
```

---

#### Issue: Frontend can't connect to backend

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Check backend is running on port 5000
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check for CORS errors in browser console
4. Ensure no firewall blocking connections

---

#### Issue: Not receiving OTP emails

**Possible causes:**
- Gmail app password incorrect
- Less secure apps blocked
- Email in spam folder
- SMTP credentials wrong

**Solution:**
```bash
# Test email service
cd server
node

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password'
  }
});

transporter.verify((error, success) => {
  if (error) console.log('❌ Error:', error);
  else console.log('✅ Server is ready');
});
```

**Check:**
1. Gmail 2-Step Verification enabled
2. App Password generated (not regular password)
3. SMTP_USER and SMTP_PASS in .env
4. Check spam/junk folder

---

#### Issue: JWT token expired

**Error:** `401 Unauthorized` or `Token expired`

**Solution:**
- Login again to get new token
- Token expires after 7 days (default)
- Check JWT_EXPIRE in .env to adjust

---

#### Issue: MongoDB connection failed

**Error:** `MongooseServerSelectionError`

**Solutions:**
1. **Local MongoDB:** Ensure service is running
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **MongoDB Atlas:** 
   - Check connection string format
   - Verify IP whitelist includes your IP
   - Confirm username/password correct
   - Database name matches

---

#### Issue: Build fails

**Error:** `Module not found` or `Cannot find module`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

---

#### Issue: Port already in use

**Error:** `EADDRINUSE: Port 5000 is already in use`

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

---

### Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// server.js
const morgan = require('morgan');
app.use(morgan('dev')); // Already enabled

// Add more detailed logging
console.log('Request:', req.method, req.path, req.body);
```

**Frontend:**
```typescript
// lib/api.ts
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);
```

---

## 📋 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Receive OTP email
- [ ] Verify OTP (correct code)
- [ ] Verify OTP (wrong code)
- [ ] Resend OTP
- [ ] Login with verified account
- [ ] Login with unverified account
- [ ] Logout

**Transactions:**
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] View transaction list
- [ ] Filter by category
- [ ] Delete transaction

**Groups:**
- [ ] Add friend
- [ ] Create group expense (equal split)
- [ ] Create group expense (custom split)
- [ ] Friend receives email notification
- [ ] Mark payment as paid
- [ ] View payment history

**Goals:**
- [ ] Create savings goal
- [ ] Add funds to goal
- [ ] View progress bar
- [ ] Complete goal
- [ ] Delete goal

**Settings:**
- [ ] Update profile name
- [ ] Change currency
- [ ] Set monthly budget
- [ ] Update income

---

## 🔮 Future Enhancements

### Planned Features

#### Phase 1 (Short-term)
- [ ] **Real-time Notifications** - WebSocket integration for live updates
- [ ] **Dark Mode Toggle** - User preference for theme
- [ ] **Export Data** - PDF/CSV export for transactions
- [ ] **Receipt Upload** - Image attachments for expenses
- [ ] **Category Management** - Custom expense categories

#### Phase 2 (Medium-term)
- [ ] **Mobile App** - React Native version
- [ ] **Multi-language** - i18n support (Hindi, Spanish, French)
- [ ] **Bank Integration** - Connect bank accounts (Plaid API)
- [ ] **Recurring Transactions** - Auto-add monthly expenses
- [ ] **Budget Alerts** - Push notifications for overspending

#### Phase 3 (Long-term)
- [ ] **AI Insights** - Spending pattern analysis
- [ ] **Investment Tracking** - Stocks, mutual funds
- [ ] **Tax Calculator** - Estimate tax liability
- [ ] **Debt Management** - Loan tracking & payoff calculator
- [ ] **Family Accounts** - Shared family finance management

### Community Requests

Have a feature idea? [Open an issue](https://github.com/yourusername/financer/issues) with the "enhancement" label!

---

## 📄 License

This project is licensed under the **ISC License**.

```
Copyright (c) 2025 Financer

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 📧 Support & Contact

### Get Help

- **Documentation:** Read this README and [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues:** [Report bugs](https://github.com/yourusername/financer/issues)
- **Discussions:** [Community forum](https://github.com/yourusername/financer/discussions)
- **Email:** support@financer.app

### Credits

Built with ❤️ by the Financer team

**Technologies Used:**
- Next.js, React, TypeScript
- Node.js, Express, MongoDB
- Tailwind CSS, Recharts, Lucide Icons
- Nodemailer, JWT, bcrypt

**Special Thanks:**
- shadcn/ui for component patterns
- Vercel for Next.js
- MongoDB for database hosting
- Gmail for SMTP service

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---


---

<p align="center">
  <strong>💰 Financer - Take Control of Your Financial Future 💰</strong>
  <br><br>
  <a href="https://github.com/yourusername/financer">GitHub</a> •
  <a href="./DEPLOYMENT.md">Deployment Guide</a> •
  <a href="./QUICKSTART.md">Quick Start</a>
  <br><br>
  Made with ❤️ for better financial management
</p>


