'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Wallet,
  TrendingUp,
  Users,
  Target,
  Bell,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  const handleGetStarted = () => {
    if (isHydrated && isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <img src="/favicon.ico" alt="Financer logo" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financer
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={handleSignIn} size="sm" className="text-xs sm:text-sm">
              Sign In
            </Button>
            <Button onClick={handleGetStarted} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32">
        <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            Smart Finance Management
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight px-4">
            Take Control of Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
            Track expenses, split bills with friends, set savings goals, and get intelligent reminders.
            All in one powerful finance management platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 px-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
            >
              Learn More
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 px-4">
            ✨ No credit card required • 🔒 Your data is secure
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 px-4">
            Everything You Need
          </h2>
          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
            Powerful features designed to simplify your financial life
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: TrendingUp,
              title: 'Income & Expense Tracking',
              description: 'Monitor all your transactions in one place. Categorize and analyze your spending patterns.',
              color: 'from-green-500 to-emerald-600'
            },
            {
              icon: Users,
              title: 'Split Bills with Friends',
              description: 'Easily split group expenses. Track who owes what and manage payments effortlessly.',
              color: 'from-blue-500 to-cyan-600'
            },
            {
              icon: Target,
              title: 'Savings Goals',
              description: 'Set financial targets and track your progress. Achieve your dreams one goal at a time.',
              color: 'from-purple-500 to-pink-600'
            },
            {
              icon: Bell,
              title: 'Smart Reminders',
              description: 'Never miss a payment. Get automated reminders for pending bills and friend payments.',
              color: 'from-orange-500 to-red-600'
            },
            {
              icon: PieChart,
              title: 'Visual Analytics',
              description: 'Beautiful charts and insights. Understand your finances at a glance with detailed reports.',
              color: 'from-indigo-500 to-blue-600'
            },
            {
              icon: Wallet,
              title: 'Budget Management',
              description: 'Set monthly budgets and track spending. Stay on top of your financial health.',
              color: 'from-teal-500 to-green-600'
            }
          ].map((feature, idx) => (
            <Card key={idx} className="border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
              Why Choose Financer?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              We make personal finance management simple, powerful, and accessible to everyone.
            </p>
            <div className="space-y-4">
              {[
                'Free forever with no hidden costs',
                'Bank-level security for your data',
                'Beautiful, intuitive interface',
                'Works seamlessly across all devices',
                'Real-time sync and updates',
                'Email notifications for important events'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-700 dark:text-zinc-300 text-lg">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <Card className="relative border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-8 w-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
                          <div className="h-2 w-16 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="border-2 border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10">
          <CardContent className="p-12 md:p-16 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Join thousands of users who are taking control of their finances with Financer.
              Start your journey today—completely free!
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 h-14"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Financer
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              © 2025 Financer. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
}
