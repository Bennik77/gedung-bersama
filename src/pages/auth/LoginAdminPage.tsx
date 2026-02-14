import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, ArrowLeft, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LoginAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login({ email, password }, 'admin');

    if (result.success) {
      toast({
        title: 'Berhasil masuk!',
        description: 'Selamat datang di Dashboard Admin.',
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Gagal masuk',
        description: result.message || 'Email atau password salah. Silakan coba lagi.',
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
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <Card className="shadow-card-hover border-0">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-primary shadow-primary relative">
                <Building2 className="h-8 w-8 text-primary-foreground" />
                <div className="absolute -bottom-1 -right-1 bg-warning rounded-full p-1">
                  <Shield className="h-3 w-3 text-warning-foreground" />
                </div>
              </div>
            </div>
            <CardTitle className="font-poppins text-2xl">Login Admin</CardTitle>
            <CardDescription>
              Akses dashboard administrasi PinjamGedungku
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Admin</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@peminjaman.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
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
                  'Masuk sebagai Admin'
                )}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Login sebagai Peminjam
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-2">Akun Demo Admin:</p>
              <p className="text-muted-foreground">Email: admin@peminjaman.id</p>
              <p className="text-muted-foreground">Password: password</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginAdminPage;
