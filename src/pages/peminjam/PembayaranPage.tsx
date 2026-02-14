import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, QrCode, ArrowLeft, Loader2, CheckCircle, Copy, Printer, Building, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const PembayaranPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { myPeminjaman, getGedung, createPembayaran, myPembayaran, confirmPembayaran } = useData();
  const [step, setStep] = useState<'method' | 'qris' | 'transfer_instruction' | 'receipt'>('method');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPembayaran, setCurrentPembayaran] = useState<any>(null);

  const peminjaman = myPeminjaman.find(p => p.id_peminjaman === Number(id));
  const gedung = peminjaman ? getGedung(peminjaman.id_gedung) : null;
  const existingPayment = myPembayaran.find(p => p.id_peminjaman === Number(id));

  if (!peminjaman || !gedung) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Data tidak ditemukan</p></div>;
  }

  if (peminjaman.status_peminjaman !== 'disetujui') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" />Kembali</Button>
        <Card className="shadow-card"><CardContent className="py-12 text-center"><p className="text-muted-foreground">Pembayaran hanya tersedia untuk peminjaman yang sudah disetujui.</p></CardContent></Card>
      </div>
    );
  }

  const handlePayment = async (metode: 'qris' | 'transfer_bank') => {
    setIsLoading(true);
    const result = await createPembayaran(peminjaman.id_peminjaman, metode);
    if (result) {
      setCurrentPembayaran(result);
      if (metode === 'qris') {
        setStep('qris');

        setTimeout(async () => {
          if (result && result.id_pembayaran) {
            await confirmPembayaran(result.id_pembayaran, 'berhasil');
            setStep('receipt');
            toast({ title: 'Pembayaran Berhasil!', description: 'Struk pembayaran telah dikirim ke email.' });
          }
        }, 3000);
      } else {

        setTimeout(async () => {
          if (result && result.id_pembayaran) {
            await confirmPembayaran(result.id_pembayaran, 'berhasil');
            setStep('receipt');
            toast({ title: 'Pembayaran Berhasil!', description: 'Struk pembayaran terkirim ke email.' });
          }
        }, 1000);
      }
    }
    setIsLoading(false);
  };

  const handleCopyCode = () => {
    const code = currentPembayaran?.kode_booking || existingPayment?.kode_booking || '';
    navigator.clipboard.writeText(code);
    toast({ title: 'Kode disalin!', description: `Kode booking ${code} berhasil disalin.` });
  };

  const handlePrint = () => {
    window.print();
  };


  if (existingPayment && !currentPembayaran) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" />Kembali</Button>
        <ReceiptCard peminjaman={peminjaman} gedung={gedung} pembayaran={existingPayment} onCopy={handleCopyCode} onPrint={handlePrint} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" />Kembali</Button>

      {step === 'method' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Detail Peminjaman</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Gedung</span><span className="font-medium">{gedung.nama_gedung}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{format(new Date(peminjaman.tanggal_mulai), 'd MMM yyyy', { locale: idLocale })} - {format(new Date(peminjaman.tanggal_selesai), 'd MMM yyyy', { locale: idLocale })}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tujuan</span><span>{peminjaman.tujuan_acara}</span></div>
              <Separator />
              <div className="flex justify-between text-lg font-bold"><span>Total Bayar</span><span className="gradient-text">{formatRupiah(gedung.harga_sewa)}</span></div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle>Pilih Metode Pembayaran</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-4 h-16 text-left" onClick={() => handlePayment('qris')} disabled={isLoading}>
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center"><QrCode className="h-5 w-5 text-primary-foreground" /></div>
                <div><p className="font-medium">QRIS</p><p className="text-xs text-muted-foreground">Bayar dengan semua e-wallet & mobile banking</p></div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-4 h-16 text-left" onClick={() => handlePayment('transfer_bank')} disabled={isLoading}>
                <div className="w-10 h-10 rounded-lg bg-gradient-secondary flex items-center justify-center"><CreditCard className="h-5 w-5 text-secondary-foreground" /></div>
                <div><p className="font-medium">Transfer Bank</p><p className="text-xs text-muted-foreground">BCA, BNI, BRI, Mandiri, dll.</p></div>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 'qris' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle>Scan QRIS</CardTitle>
              <p className="text-sm text-muted-foreground">Scan kode QR ini menggunakan HP Anda</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-xl p-4">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`http://localhost:5173/pembayaran/konfirmasi/${currentPembayaran?.id_pembayaran}`)}`} alt="QR Code" className="w-full h-full" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-bold">{formatRupiah(gedung.harga_sewa)}</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground mb-4">
                  {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'BCA Mobile'].map(w => (
                    <Badge key={w} variant="outline">{w}</Badge>
                  ))}
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border border-dashed text-center">
                  <p className="text-sm font-semibold mb-1">Status: Menunggu Scan...</p>
                  <p className="text-xs text-muted-foreground">Pembayaran akan dikonfirmasi otomatis dalam beberapa detik.</p>
                  <div className="mt-3 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 'transfer_instruction' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Mail className="h-8 w-8" />
              </div>
              <CardTitle>Memproses Transfer...</CardTitle>
              <p className="text-muted-foreground">Menghubungkan ke server bank...</p>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm">Mohon tunggu sebentar, sistem sedang memverifikasi detail transfer Anda.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 'transfer_instruction' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Mail className="h-8 w-8" />
              </div>
              <CardTitle>Instruksi Terkirim!</CardTitle>
              <p className="text-muted-foreground">Cek email Anda untuk melakukan pembayaran</p>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm">Kami telah mengirimkan instruksi transfer ke email terdaftar Anda. Silakan ikuti tautan di email tersebut untuk mengonfirmasi pembayaran.</p>

              <div className="bg-muted p-4 rounded-lg text-left text-sm space-y-2">
                <p className="font-semibold">Simulasi:</p>
                <p>Karena ini demo, Anda bisa langsung klik tombol di bawah ini (Pura-pura buka email):</p>
                <Button variant="outline" className="w-full mt-2" onClick={() => window.open(`/pembayaran/konfirmasi/${currentPembayaran?.id_pembayaran}`, '_blank')}>
                  <Mail className="mr-2 h-4 w-4" /> Buka Link dari Email (Simulasi)
                </Button>
              </div>

              <Button variant="ghost" onClick={() => window.location.reload()}>Saya sudah bayar (Refresh)</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 'receipt' && currentPembayaran && (
        <ReceiptCard peminjaman={peminjaman} gedung={gedung} pembayaran={currentPembayaran} onCopy={handleCopyCode} onPrint={handlePrint} />
      )}
    </div>
  );
};

const ReceiptCard: React.FC<{ peminjaman: any; gedung: any; pembayaran: any; onCopy: () => void; onPrint: () => void }> = ({ peminjaman, gedung, pembayaran, onCopy, onPrint }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="shadow-card-hover border-success/30">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2"><CheckCircle className="h-8 w-8 text-success" /></div>
        <CardTitle className="text-success">Pembayaran {pembayaran.status_pembayaran === 'berhasil' ? 'Berhasil' : 'Pending'}</CardTitle>
        <p className="text-sm text-muted-foreground">Struk digital peminjaman gedung</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Kode Booking</p>
          <p className="text-2xl font-mono font-bold tracking-wider">{pembayaran.kode_booking}</p>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Gedung</span><span className="font-medium">{gedung.nama_gedung}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Lokasi</span><span>{gedung.lokasi}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{format(new Date(peminjaman.tanggal_mulai), 'd MMM yyyy', { locale: idLocale })} - {format(new Date(peminjaman.tanggal_selesai), 'd MMM yyyy', { locale: idLocale })}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tujuan</span><span>{peminjaman.tujuan_acara}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Metode</span><span className="uppercase">{pembayaran.metode_pembayaran.replace('_', ' ')}</span></div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="gradient-text">{formatRupiah(pembayaran.jumlah)}</span></div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={onCopy}><Copy className="h-4 w-4" />Salin Kode</Button>
          <Button className="flex-1 bg-gradient-primary hover:opacity-90 gap-2" onClick={onPrint}><Printer className="h-4 w-4" />Cetak Struk</Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>Struk ini merupakan bukti pembayaran yang sah.</p>
          <p>Tunjukkan kode booking kepada petugas saat hari H.</p>
          <p className="mt-1 font-medium">PinjamGedungku - Kelompok 7 IF6 UNIKOM</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default PembayaranPage;
