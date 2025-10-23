# Vibe Coding Hackathon Submission - Financer

## 📋 Project Overview

**Project Name:** Financer - Personal and Group Finance Management Platform  
**Team Member:** Zeeshan  
**Submission Date:** October 23, 2025  
**Repository :** https://github.com/zeeshan-890/financer
**Demo video :** https://drive.google.com/file/d/1mSBeeYdNPLHPg7rEoVgTLOE4FtOnLxDi/view?usp=drive_link

---

## 🤖 LLM Used

**Primary LLM:** GitHub Copilot (Claude Sonnet 4.5)  
**Version:** Latest (October 2025)  
**Usage:** 100% of code generated through AI assistance via GitHub Copilot in VS Code

---

## 🌐 Published Website

**Live Demo:** https://financerzeeshanabbas-512be7f5802e.herokuapp.com/

*Note: Currently being deployed to Heroku. The deployment process involved:*
- Configuring Node.js 20.x for Next.js 16 compatibility
- Moving TypeScript to production dependencies
- Adding Suspense boundaries for Next.js static export
- Setting up environment variables for MongoDB Atlas and email service

---

## 🎯 Project Goals

Financer is a comprehensive full-stack finance management application designed to help individuals and groups:

### Primary Objectives:
1. **Personal Finance Tracking** - Monitor income and expenses with detailed analytics
2. **Group Expense Management** - Split bills with friends and track who owes what
3. **Savings Goals** - Set financial targets and track progress
4. **Smart Reminders** - Get automated email notifications for pending payments
5. **Visual Analytics** - Beautiful charts and insights for financial overview

### Target Audience:
- College students managing shared expenses
- Roommates splitting bills
- Friend groups tracking group purchases
- Individuals wanting to track personal finances

### Unique Features:
- **Dual Expense System** - Both personal transactions and group expenses
- **Friend Management** - Add friends with detailed info (university, hostel, etc.)
- **Flexible Split Options** - Equal or custom split amounts
- **Payment Tracking** - Mark payments as paid/pending with timestamps
- **Email Notifications** - Automated OTP verification and payment reminders
- **Dark Mode** - Full dark mode support throughout the application
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

---

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 16.0.0 (React 19.2.0)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **State Management:** Zustand 5.0.2
- **HTTP Client:** Axios 1.6.2
- **Charts:** Recharts 2.15.0
- **UI Components:** Custom components built with Radix UI primitives
- **Icons:** Lucide React 0.468.0
- **Notifications:** React Hot Toast 2.6.0

### Backend
- **Runtime:** Node.js 20.x
- **Framework:** Express.js 4.21.1
- **Language:** JavaScript (ES6+)
- **Database:** MongoDB with Mongoose 8.8.4
- **Authentication:** JWT (jsonwebtoken 9.0.2), bcryptjs 2.4.3
- **Email Service:** Nodemailer 6.10.0 (Gmail SMTP)
- **Validation:** express-validator 7.2.1
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Morgan, Winston

### DevOps & Deployment
- **Deployment Platform:** Heroku
- **Database Hosting:** MongoDB Atlas
- **Version Control:** Git & GitHub
- **Build Configuration:** Next.js static export served by Express

### Development Tools
- **Code Generation:** 100% AI-powered with GitHub Copilot (Claude Sonnet 3.5)
- **IDE:** Visual Studio Code
- **Package Manager:** npm
- **Linting:** ESLint with Next.js config

---

## 🎨 AI-Powered Development Process

### 1. Initial Project Setup
**Prompts Used:**
- "Create a complete full-stack finance management app with Next.js frontend and Express backend"
- "Set up MongoDB models for User, Transaction, Goal, Group, Notification, and Reminder"
- "Implement JWT authentication with email OTP verification"

**AI Contribution:**
- Generated complete project structure
- Created all database models with proper schemas
- Implemented authentication flow with security best practices

### 2. Frontend Development
**Prompts Used:**
- "Create a beautiful landing page with gradient designs and feature sections"
- "Build dashboard with charts showing income/expense analytics"
- "Design transaction list with filters and CRUD operations"
- "Create group expense splitting system with equal and custom split options"
- "Build savings goals tracker with progress bars"
- "Make all pages responsive for mobile, tablet, and desktop"

**AI Contribution:**
- Generated all page components with TypeScript
- Created responsive layouts using Tailwind CSS
- Implemented state management with Zustand
- Built reusable UI components (Button, Card, Input, Label)
- Added dark mode support throughout

### 3. Backend Development
**Prompts Used:**
- "Create RESTful API endpoints for authentication, transactions, goals, and groups"
- "Implement email service with OTP verification and reminders"
- "Add middleware for authentication, error handling, and request validation"
- "Set up cron jobs for automated reminders"

**AI Contribution:**
- Generated all API routes with proper error handling
- Implemented secure authentication with JWT
- Created email templates and notification system
- Built validation middleware for all endpoints
- Set up database queries with Mongoose

### 4. Deployment Configuration
**Prompts Used:**
- "Configure the app for single-server deployment with Express serving Next.js static files"
- "Fix Heroku deployment errors (Node version, TypeScript dependencies, Suspense boundaries)"
- "Create deployment documentation for multiple platforms"

**AI Contribution:**
- Configured Next.js static export to server/public
- Set up Express to serve both API and frontend
- Fixed deployment issues (Node 20.x, TypeScript in dependencies)
- Created comprehensive deployment guides

### 5. UI/UX Refinement
**Prompts Used:**
- "Simplify group expense card design - remove colorful gradients, use minimal style"
- "Add mobile hamburger menu to navbar"
- "Make all forms and modals responsive"
- "Improve button sizes and spacing for mobile devices"

**AI Contribution:**
- Redesigned components based on feedback
- Implemented responsive navigation with mobile menu
- Optimized all pages for different screen sizes
- Added touch-friendly button sizes

---

## 📊 Performance Report

### Frontend Performance
✅ **Static Export** - Next.js app exported as static HTML/CSS/JS for fast loading  
✅ **Code Splitting** - Automatic route-based code splitting  
✅ **Optimized Assets** - Images and fonts optimized for web  
✅ **Responsive Design** - Mobile-first approach with Tailwind CSS  
✅ **Dark Mode** - Efficient theme switching with no flash

### Backend Performance
✅ **MongoDB Indexing** - Indexed fields for faster queries  
✅ **JWT Authentication** - Stateless authentication for scalability  
✅ **Error Handling** - Comprehensive error middleware  
✅ **Rate Limiting** - Protection against abuse  
✅ **CORS Configuration** - Secure cross-origin requests

### Functionality Report

#### ✅ Implemented Features
1. **Authentication System**
   - User registration with email verification
   - OTP-based verification (6-digit code)
   - JWT token-based authentication
   - Secure password hashing with bcrypt
   - Session management with Zustand

2. **Transaction Management**
   - Add income/expense transactions
   - Categorize transactions
   - Filter by type, category, date range
   - Visual analytics with pie and bar charts
   - Delete transactions

3. **Group Expenses**
   - Create group expenses with friends
   - Equal or custom split options
   - Track payment status (paid/pending)
   - Mark payments as received
   - View split summaries

4. **Savings Goals**
   - Set financial targets with deadlines
   - Add funds to goals
   - Track progress with visual progress bars
   - View contribution history
   - Delete completed goals

5. **Friend Management**
   - Add friends with detailed info
   - Store contact details, university, hostel info
   - Remove friends
   - Use friends in group expense splits

6. **Settings & Profile**
   - Update profile information
   - Set preferred currency
   - Configure monthly budget
   - Set monthly income

7. **Email Notifications**
   - OTP verification emails
   - Welcome emails on registration
   - Payment reminder notifications (cron-based)

8. **Responsive Design**
   - Mobile-optimized navigation with hamburger menu
   - Responsive grids and layouts
   - Touch-friendly buttons and forms
   - Adaptive typography and spacing

#### 🎯 User Experience
- Clean, modern UI with gradient accents
- Intuitive navigation across all pages
- Real-time form validation
- Toast notifications for user feedback
- Loading states for async operations
- Error handling with user-friendly messages

---

## 📁 Source Code Structure

```
financer/
├── client/                      # Next.js Frontend
│   ├── app/                     # App Router pages
│   │   ├── dashboard/          # Dashboard with analytics
│   │   ├── transactions/       # Transaction management
│   │   ├── goals/              # Savings goals
│   │   ├── groups/             # Group expenses
│   │   ├── settings/           # User settings & friends
│   │   ├── login/              # Login page
│   │   ├── signup/             # Registration page
│   │   ├── verify-otp/         # OTP verification
│   │   ├── layout.tsx          # Root layout with Navbar
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI primitives
│   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   ├── AddTransactionModal.tsx
│   │   └── AddGroupExpenseModal.tsx
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # Axios API client
│   │   └── utils.ts            # Helper functions
│   ├── store/                  # State management
│   │   └── authStore.ts        # Zustand auth store
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS config
│   └── package.json            # Frontend dependencies
│
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Request handlers
│   │   ├── authController.js   # Auth logic
│   │   ├── transactionController.js
│   │   ├── goalController.js
│   │   ├── groupController.js
│   │   └── userController.js
│   ├── middlewares/            # Express middleware
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── errorHandler.js     # Error handling
│   │   ├── validateRequest.js  # Input validation
│   │   └── logger.js           # Request logging
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Goal.js
│   │   ├── Group.js
│   │   ├── Notification.js
│   │   └── Reminder.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── userRoutes.js
│   ├── services/               # Business logic
│   │   ├── emailService.js     # Nodemailer setup
│   │   └── cronService.js      # Scheduled tasks
│   ├── utils/                  # Utilities
│   │   ├── token.js            # JWT helpers
│   │   └── validators.js       # Custom validators
│   ├── server.js               # Express app entry
│   ├── public/                 # Next.js static export
│   └── package.json            # Backend dependencies
│
├── package.json                # Root package for Heroku
├── Procfile                    # Heroku process file
├── .gitignore                  # Git ignore patterns
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Deployment guide
└── HEROKU_DEPLOYMENT.md        # Heroku-specific guide
```

---

## 🎬 Demo Video

**Demo video :** https://drive.google.com/file/d/1mSBeeYdNPLHPg7rEoVgTLOE4FtOnLxDi/view?usp=drive_link

**Video Content Should Cover:**
1. Landing page and registration flow (0:00-0:15)
2. Dashboard with analytics and charts (0:15-0:25)
3. Adding transactions and viewing list (0:25-0:35)
4. Creating group expense with split (0:35-0:45)
5. Savings goals and settings page (0:45-0:55)
6. Mobile responsiveness demo (0:55-1:00)

---

## 📝 Detailed Prompts & Results

### Conversation Summary

**Total AI Sessions:** 1 comprehensive session with GitHub Copilot  
**Total Prompts:** ~50+ prompts across 6 major phases  
**Code Generated:** ~10,000+ lines (100% AI-assisted)

### Phase 1: Project Initialization
```
User: "Create a complete full-stack finance management app"
AI: Generated entire project structure, package.json files, and initial setup

User: "Set up MongoDB models for User, Transaction, Goal"
AI: Created Mongoose schemas with proper validation and relationships
```

### Phase 2: Authentication System
```
User: "Implement JWT authentication with email OTP verification"
AI: Built complete auth flow with registration, login, OTP verification

User: "Create email service with OTP templates"
AI: Set up Nodemailer with Gmail SMTP and HTML email templates
```

### Phase 3: Frontend Pages
```
User: "Create dashboard with charts showing analytics"
AI: Built dashboard with Recharts pie and bar charts

User: "Build transaction list with filters"
AI: Implemented filtering by type, category, date range

User: "Create group expense splitting system"
AI: Built dual-mode split (equal/custom) with friend selection
```

### Phase 4: UI/UX Improvements
```
User: "Make group expense cards simple, not too colorful"
AI: Redesigned with minimal borders and neutral colors

User: "Add mobile hamburger menu to navbar"
AI: Implemented responsive navigation with mobile menu

User: "Make all pages responsive"
AI: Updated all components with responsive breakpoints
```

### Phase 5: Deployment Configuration
```
User: "Configure for single-server deployment"
AI: Set up Next.js static export served by Express

User: "Fix Heroku Node.js version error"
AI: Updated engines to Node 20.x for Next.js 16

User: "Fix TypeScript not found during build"
AI: Moved TypeScript to dependencies

User: "Fix useSearchParams Suspense error"
AI: Wrapped component in Suspense boundary
```

### Phase 6: Documentation
```
User: "Create comprehensive README"
AI: Generated 1500+ line README with all features

User: "Create Heroku deployment guide"
AI: Built step-by-step deployment documentation

User: "Prepare hackathon submission materials"
AI: Created this comprehensive submission document
```

**Full Chat History:** Available in GitHub Copilot chat history  
*Note: GitHub Copilot chat history is tied to VS Code session*

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js 20.x or higher
- MongoDB Atlas account (or local MongoDB)
- Gmail account for SMTP (or other email service)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/zeeshan-890/financer.git
   cd financer
   ```

2. **Set up Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cat > .env << EOF
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password
   EMAIL_FROM=Financer <your_email@gmail.com>
   NODE_ENV=development
   EOF
   
   npm start
   ```

3. **Set up Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4

### Production Deployment (Heroku)

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set MONGO_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set SMTP_USER=your_email
   heroku config:set SMTP_PASS=your_password
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🎓 Learning Outcomes & AI Experience

### Skills Developed
1. **Full-Stack Development** - Built complete MERN stack application
2. **TypeScript** - Learned type-safe React development
3. **Next.js 16** - Mastered latest Next.js features (App Router, Static Export)
4. **MongoDB** - Designed complex database schemas
5. **Authentication** - Implemented JWT + OTP verification
6. **Responsive Design** - Created mobile-first UI
7. **Deployment** - Configured Heroku deployment with troubleshooting

### AI Collaboration Experience
✅ **Highly Effective** - AI understood complex requirements  
✅ **Iterative Refinement** - Easy to request changes and improvements  
✅ **Error Resolution** - AI helped debug deployment issues  
✅ **Documentation** - AI generated comprehensive docs  
✅ **Best Practices** - AI suggested security and performance optimizations

### Challenges Overcome
1. **Heroku Deployment Issues** - Fixed through AI-guided troubleshooting
2. **Next.js 16 Compatibility** - Required Node 20.x upgrade
3. **Static Export with API** - Configured dual-mode Express serving
4. **Responsive Design** - Iterated on mobile layouts with AI suggestions

### Time Efficiency
- **Traditional Development Estimate:** 2-3 weeks
- **AI-Assisted Development:** 2-3 days
- **Speed Increase:** ~5-10x faster with AI

---

## 📞 Contact & Links

**GitHub Repository:** https://github.com/zeeshan-890/financer  
**Demo video :** https://drive.google.com/file/d/1mSBeeYdNPLHPg7rEoVgTLOE4FtOnLxDi/view?usp=drive_link 
**Developer:** Zeeshan Abbas
**Email:** zzabbaskhan830@gmail.com  
**Hackathon:** NYU Vibe Coding Hackathon 2025.

---

## 🙏 Acknowledgments

- **NYU Vibe Coding Hackathon** - For organizing this amazing event
- **GitHub Copilot (Claude Sonnet 3.5)** - For incredible AI assistance
- **OpenAI & Anthropic** - For advancing AI technology
- **Next.js & React Teams** - For excellent frameworks
- **MongoDB & Heroku** - For reliable hosting services

---

## ✨ Final Notes

This project demonstrates the power of AI-assisted development in creating production-ready applications. Every line of code, from authentication to deployment configuration, was generated through collaborative prompting with GitHub Copilot.

The result is a fully functional, responsive, and secure finance management platform that would typically take weeks to build, completed in just days through effective AI collaboration.

**Thanks for vibing with us! 😎🚀**

---

*Submission Date: October 23, 2025*  
*Project: Financer - AI-Powered Finance Management Platform*
