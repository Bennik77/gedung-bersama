import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, ArrowLeft, Loader2, User, Phone, MapPin, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, verifyOtp } = useAuth();

  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [formData, setFormData] = useState({
    nama_peminjam: '',
    email: '',
    password: '',
    confirmPassword: '',
    no_telepon: '',
    alamat: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();


    if (formData.password.length < 8) {
      toast({
        title: 'Password terlalu pendek',
        description: 'Password minimal harus 8 karakter.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password tidak cocok',
        description: 'Pastikan password dan konfirmasi password sama.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = await register({
      nama_peminjam: formData.nama_peminjam,
      email: formData.email,
      password: formData.password,
      no_telepon: formData.no_telepon,
      alamat: formData.alamat,
    });

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Kode Verifikasi Terkirim',
        description: result.message || 'Silakan cek email Anda untuk kode verifikasi.',
      });
      setStep('otp');
    } else {
      toast({
        title: 'Pendaftaran gagal',
        description: result.message || 'Terjadi kesalahan saat mendaftar.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await verifyOtp(formData.email, otpCode);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Akun Terverifikasi!',
        description: 'Pendaftaran berhasil. Silakan login.',
      });
      navigate('/login');
    } else {
      toast({
        title: 'Verifikasi Gagal',
        description: result.message || 'Kode OTP salah.',
        variant: 'destructive',
      });
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-card-hover border-0">
            <CardHeader className="text-center pb-0">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-gradient-primary shadow-primary">
                  <Mail className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="font-poppins text-2xl">Verifikasi Email</CardTitle>
              <CardDescription>
                Masukkan 6 digit kode yang dikirim ke <strong>{formData.email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Kode Verifikasi</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Contoh: 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifikasi
                    </>
                  ) : (
                    'Verifikasi Akun'
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => setStep('register')}
                    className="text-sm text-muted-foreground"
                  >
                    Kembali ke Form Daftar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4 py-12">
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
              <div className="p-3 rounded-2xl bg-gradient-primary shadow-primary">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="font-poppins text-2xl">Daftar Akun</CardTitle>
            <CardDescription>
              Buat akun untuk mulai meminjam gedung
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_peminjam">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nama_peminjam"
                    name="nama_peminjam"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama_peminjam}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-destructive mt-1 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  WAJIB gunakan email asli (Gmail/Yahoo/dll) untuk menerima tiket & bukti pembayaran!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_telepon">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="no_telepon"
                    name="no_telepon"
                    type="tel"
                    placeholder="081234567890"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="alamat"
                    name="alamat"
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="pl-10 min-h-[80px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
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
                  <Label htmlFor="confirmPassword">Konfirmasi</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ulangi"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                  'Daftar Sekarang'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
