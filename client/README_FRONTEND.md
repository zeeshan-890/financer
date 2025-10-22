# Financer - Frontend

Next.js frontend for the Financer personal finance management app.

## Features

- 🔐 Authentication (Login/Signup)
- 📊 Dashboard with charts and statistics
- 👥 Group expense management
- 💰 Transaction tracking
- 🎯 Savings goals with progress tracking
- ⚙️ User settings and preferences

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui style
- **State Management**: Zustand
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Main dashboard with stats and charts
- `/groups` - Group management and bill splitting
- `/transactions` - Transaction history
- `/goals` - Savings goals tracking
- `/settings` - User preferences

## Project Structure

```
client/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── groups/            # Groups page
│   ├── transactions/      # Transactions page
│   ├── goals/             # Goals page
│   ├── settings/          # Settings page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # UI components (button, card, input, etc.)
│   └── Navbar.tsx        # Navigation bar
├── lib/                  # Utility functions
│   ├── api.ts           # API client and endpoints
│   └── utils.ts         # Helper functions
└── store/               # State management
    └── authStore.ts     # Authentication state
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000/api` (configurable via `NEXT_PUBLIC_API_URL`).

All API calls are authenticated using JWT tokens stored in localStorage.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel:
```bash
vercel
```

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable in your deployment settings.
