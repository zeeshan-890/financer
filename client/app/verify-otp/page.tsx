'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Mail, Shield } from 'lucide-react';

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, login } = useAuthStore();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const email = searchParams.get('email') || user?.email || '';

    useEffect(() => {
        if (!email) {
            router.push('/login');
        }
    }, [email, router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await authApi.verifyOTP({ email, otp });
            toast.success(response.data.message || 'Email verified successfully!');

            // Update user in store if user data is returned
            if (response.data.user && user) {
                login({ ...user, isVerified: true }, localStorage.getItem('token') || '');
            }

            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        try {
            setResending(true);
            await authApi.resendOTP({ email });
            toast.success('OTP sent to your email!');
            setCountdown(60); // 60 second cooldown
            setOtp('');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    const handleSkip = () => {
        router.push('/dashboard');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                        <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        We've sent a 6-digit OTP to <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                }}
                                maxLength={6}
                                className="text-center text-2xl tracking-widest"
                                autoFocus
                            />
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                                OTP expires in 10 minutes
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </Button>

                        <div className="flex items-center justify-between text-sm">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resending || countdown > 0}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                            </button>
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                            >
                                Skip for now
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-zinc-700 dark:text-zinc-300">
                                    <p className="font-medium mb-1">Didn't receive the email?</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                                        <li>Check your spam/junk folder</li>
                                        <li>Make sure {email} is correct</li>
                                        <li>Click "Resend OTP" to get a new code</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
                <div className="text-center">
                    <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
                </div>
            </div>
        }>
            <VerifyOTPContent />
        </Suspense>
    );
}
