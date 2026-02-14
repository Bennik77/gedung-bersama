import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Loader2, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';

const PaymentGateway: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [koordinator, setKoordinator] = useState<{ nama: string; telp: string } | null>(null);

    const handleConfirm = async (approved: boolean) => {
        setStatus('processing');
        try {
            const response = await fetchApi('pembayaran/confirm.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_pembayaran: id,
                    status: approved ? 'berhasil' : 'gagal'
                })
            });

            if (response.success && approved) {
                setStatus('success');
                if (response.data) {
                    /* @ts-ignore */
                    setKoordinator({ nama: response.data.koordinator, telp: response.data.telp_koordinator });
                }
            } else {
                setStatus('failed');
            }
        } catch (error) {
            setStatus('failed');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-2 border-green-500/20">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-700">Pembayaran Berhasil!</CardTitle>
                        <CardDescription>Terima kasih, pembayaran Anda telah kami terima.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <User className="h-4 w-4" /> Koordinator Lapangan
                            </h4>
                            <p className="text-lg font-bold text-slate-800">{koordinator?.nama}</p>
                            <div className="flex items-center gap-2 text-slate-600 mt-1">
                                <Phone className="h-4 w-4" />
                                <span>{koordinator?.telp}</span>
                            </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            Bukti pembayaran dan info lengkap petugas telah dikirim ke email Anda.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="border-b">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">PG</div>
                        <span className="font-bold text-lg">Payment Gateway Simulator</span>
                    </div>
                    <CardTitle>Konfirmasi Pembayaran</CardTitle>
                    <CardDescription>ID Transaksi: #{id}</CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-1">Permintaan Pembayaran</h3>
                        <p className="text-sm text-blue-600">
                            User meminta untuk menyelesaikan pembayaran ini.
                            Dalam skenario nyata, ini adalah halaman bank/QRIS setelah scan.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Merchant</span>
                            <span className="font-medium">PinjamGedungKu</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tipe</span>
                            <span className="font-medium">QRIS / Transfer</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                        onClick={() => handleConfirm(true)}
                        disabled={status === 'processing'}
                    >
                        {status === 'processing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                        Ya, Setujui Pembayaran
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleConfirm(false)}
                        disabled={status === 'processing'}
                    >
                        <XCircle className="mr-2 h-5 w-5" />
                        Batalkan
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentGateway;
