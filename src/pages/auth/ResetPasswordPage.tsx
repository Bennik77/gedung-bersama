import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { toast } = useToast();
    const { resetPassword } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast({
                title: 'Error',
                description: 'Token reset password tidak ditemukan.',
                variant: 'destructive',
            });
            navigate('/login');
        }
    }, [token, navigate, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Konfirmasi password tidak cocok.',
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Error',
                description: 'Password minimal 6 karakter.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        if (token) {
            const result = await resetPassword(password, token);

            if (result.success) {
                setIsSuccess(true);
                toast({
                    title: 'Berhasil',
                    description: 'Password Anda telah diperbarui.',
                });
            } else {
                toast({
                    title: 'Gagal',
                    description: result.message || 'Link reset password tidak valid atau kedaluwarsa.',
                    variant: 'destructive',
                });
            }
        }

        setIsLoading(false);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-card-hover border-0 text-center">
                        <CardContent className="pt-10 pb-10 space-y-6">
                            <div className="flex justify-center">
                                <div className="p-4 rounded-full bg-green-100 text-green-600">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold font-poppins">Password Diperbarui!</h2>
                                <p className="text-muted-foreground">
                                    Password akun Anda berhasil diubah. Silakan login menggunakan password baru.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full bg-gradient-primary hover:opacity-90 shadow-primary"
                            >
                                Ke Halaman Login
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-card-hover border-0">
                    <CardHeader className="text-center pb-0">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-2xl bg-gradient-primary shadow-primary">
                                <Lock className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <CardTitle className="font-poppins text-2xl">Buat Password Baru</CardTitle>
                        <CardDescription>
                            Masukkan password baru untuk akun Anda
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimal 6 karakter"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Ulangi password baru"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-xs flex gap-2 items-start border border-yellow-200">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>Pastikan password kuat dan mudah diingat. Jangan bagikan password kepada siapapun.</p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-primary hover:opacity-90 shadow-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Password'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
