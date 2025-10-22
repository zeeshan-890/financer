# 💰 Financer

An advanced personal and group finance management web application for tracking expenses, savings goals, and splitting bills with smart email reminders.

## 🚀 Features

### Personal Finance
- 📊 **Dashboard** - Visual overview of balance, expenses, and savings
- 💳 **Transaction Tracking** - Record and categorize all transactions
- 🎯 **Savings Goals** - Set targets with deadline tracking and progress bars
- 📈 **Charts & Analytics** - Pie charts for categories, bar charts for trends

### Group Finance
- 👥 **Group Management** - Create groups for shared expenses
- 💸 **Bill Splitting** - Split expenses equally among members
- 📧 **Email Reminders** - Automated payment reminders
- 📋 **Expense Tracking** - Track who owes whom

### Settings & Preferences
- 💱 **Multi-Currency** - Support for INR, USD, EUR
- 💰 **Budget Limits** - Set monthly spending limits
- 👫 **Friends Management** - Maintain a friends list for easy splitting

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom ShadCN-style components
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (bcryptjs)
- **Email**: Nodemailer
- **Scheduler**: Node Cron
- **Validation**: Joi

### Hosting
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
financer/
├── client/              # Next.js frontend
│   ├── app/            # App routes
│   ├── components/     # React components
│   ├── lib/           # Utilities & API client
│   └── store/         # Zustand stores
│
└── server/             # Express backend
    ├── config/        # Configuration files
    ├── controllers/   # Route controllers
    ├── models/        # Mongoose models
    ├── routes/        # API routes
    ├── middlewares/   # Custom middleware
    ├── services/      # Email & cron services
    └── utils/         # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- SMTP credentials (for email features)

### Backend Setup

1. Navigate to server folder:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financer
JWT_SECRET=your_super_secret_jwt_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Financer <noreply@financer.app>
```

4. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group details

### Transactions
- `POST /api/transactions` - Create transaction
- `PATCH /api/transactions/:id/pay` - Update payment status

### Goals
- `POST /api/goals` - Create savings goal
- `GET /api/goals/:userId` - Get user's goals

### Reminders
- `POST /api/reminders/send` - Send reminder emails

## 🗄️ Database Models

- **User** - User accounts with auth and preferences
- **Group** - Groups for shared expenses
- **Transaction** - Individual transactions with splits
- **Goal** - Savings goals with progress
- **Reminder** - Payment reminders
- **Notification** - In-app notifications

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend generates JWT token (7 day expiry)
3. Frontend stores token in localStorage
4. Token sent in `Authorization: Bearer <token>` header
5. Backend validates token via middleware

## 📧 Email Reminders

Automated cron job runs daily at 9:00 AM to:
- Find pending payment reminders
- Send emails to users with dues
- Mark reminders as sent

## 🎨 UI Components

Custom components built following shadcn/ui patterns:
- Button (multiple variants)
- Card (with header, content, footer)
- Input & Label
- Navigation Bar

## 📊 Charts

- **Pie Chart** - Spending by category
- **Bar Chart** - Monthly expense trends

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend (Render)
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update `MONGO_URI` in backend

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Developer Notes

### Running Both Servers Simultaneously

Using separate terminals:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Testing the Integration

1. Start both servers
2. Navigate to `http://localhost:3000`
3. Sign up for a new account
4. Explore dashboard, groups, transactions, and goals

### Email Testing

Use [Ethereal Email](https://ethereal.email/) for testing:
1. Create test account
2. Use credentials in `.env`
3. View sent emails in Ethereal inbox

## 🐛 Known Issues

- Email reminders require valid SMTP configuration
- Charts use mock data (replace with API calls)
- Some features are UI-only (need backend integration)

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] PDF export for transactions
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Bank account integration
- [ ] Receipt image upload
- [ ] Expense categories customization

## 📧 Contact

For questions or support, reach out to the development team.

---

**Happy Finance Managing! 💸**
