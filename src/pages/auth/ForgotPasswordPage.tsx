import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordPage: React.FC = () => {
    const { toast } = useToast();
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setIsSubmitted(true);
            toast({
                title: 'Email Terkirim',
                description: 'Silakan cek email Anda untuk instruksi reset password.',
            });
        } else {
            toast({
                title: 'Gagal',
                description: result.message || 'Terjadi kesalahan. Silakan coba lagi.',
                variant: 'destructive',
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Login
                </Link>

                <Card className="shadow-card-hover border-0">
                    <CardHeader className="text-center pb-0">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-2xl bg-gradient-primary shadow-primary">
                                <KeyRound className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <CardTitle className="font-poppins text-2xl">Lupa Password?</CardTitle>
                        <CardDescription>
                            {isSubmitted
                                ? 'Link reset password telah dikirim'
                                : 'Masukkan email Anda untuk mereset password'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contoh@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-primary hover:opacity-90 shadow-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Kirim Link Reset'
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                                    Kami telah mengirimkan link reset password ke <strong>{email}</strong>.
                                    Silakan cek kotak masuk atau folder spam email Anda.
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Kirim Ulang
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
