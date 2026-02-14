import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { formatRupiah } from '@/lib/utils';

const KonfirmasiPembayaranPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { myPeminjaman, getGedung, confirmPembayaran, myPembayaran } = useData();
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');


    const pembayaran = myPembayaran.find(p => p.id_pembayaran === Number(id));
    const peminjaman = pembayaran ? myPeminjaman.find(p => p.id_peminjaman === pembayaran.id_peminjaman) : null;
    const gedung = peminjaman ? getGedung(peminjaman.id_gedung) : null;

    useEffect(() => {
        if (pembayaran?.status_pembayaran === 'berhasil') setStatus('success');
        if (pembayaran?.status_pembayaran === 'gagal') setStatus('failed');
    }, [pembayaran]);

    const handleConfirm = async (choice: 'yes' | 'no') => {
        if (!pembayaran) return;
        setIsProcessing(true);

        const statusToSend = choice === 'yes' ? 'berhasil' : 'gagal';
        const success = await confirmPembayaran(pembayaran.id_pembayaran, statusToSend);

        if (success) {
            setStatus(choice === 'yes' ? 'success' : 'failed');
            toast({
                title: choice === 'yes' ? 'Pembayaran Dikonfirmasi' : 'Pembayaran Dibatalkan',
                variant: choice === 'yes' ? 'default' : 'destructive'
            });

            if (choice === 'yes') {
                setTimeout(() => navigate(`/pembayaran/${peminjaman?.id_peminjaman}`), 2000);
            }
        } else {
            toast({ title: "Gagal memproses", variant: "destructive" });
        }
        setIsProcessing(false);
    };

    if (!pembayaran || !gedung) {
        return <div className="flex items-center justify-center h-screen">Loading data...</div>;
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="max-w-md w-full shadow-lg border-success/50">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-10 w-10 text-success" />
                        </div>
                        <h2 className="text-2xl font-bold text-success">Pembayaran Berhasil!</h2>
                        <p className="text-muted-foreground">Terima kasih, pembayaran Anda telah terverifikasi.</p>
                        <Button className="w-full" onClick={() => navigate(`/pembayaran/${peminjaman?.id_peminjaman}`)}>Lihat Struk</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="max-w-md w-full shadow-lg border-destructive/50">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <h2 className="text-2xl font-bold text-destructive">Pembayaran Dibatalkan</h2>
                        <p className="text-muted-foreground">Anda telah membatalkan transaksi ini.</p>
                        <Button variant="outline" className="w-full" onClick={() => navigate(`/pembayaran/${peminjaman?.id_peminjaman}`)}>Kembali</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader className="text-center border-b pb-6">
                        <h1 className="text-xl font-bold">Konfirmasi Pembayaran</h1>
                        <p className="text-sm text-muted-foreground">Sistem Pembayaran Aman</p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total Tagihan</p>
                            <h2 className="text-3xl font-bold gradient-text">{formatRupiah(pembayaran.jumlah)}</h2>
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span>Metode</span><span className="font-medium uppercase">{pembayaran.metode_pembayaran.replace('_', ' ')}</span></div>
                            <div className="flex justify-between"><span>Gedung</span><span className="font-medium">{gedung?.nama_gedung}</span></div>
                            <div className="flex justify-between"><span>Kode Booking</span><span className="font-mono">{pembayaran.kode_booking}</span></div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <p className="text-center text-sm font-medium">Apakah Anda yakin ingin melanjutkan pembayaran ini?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-12 border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleConfirm('no')} disabled={isProcessing}>
                                    Tidak (Batal)
                                </Button>
                                <Button className="h-12 bg-success hover:bg-success/90 text-white" onClick={() => handleConfirm('yes')} disabled={isProcessing}>
                                    {isProcessing ? <Loader2 className="animate-spin" /> : "Ya, Bayar"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center border-t py-4">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Halaman ini disimulasikan sebagai Pihak Ketiga (Bank/E-Wallet)
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default KonfirmasiPembayaranPage;
