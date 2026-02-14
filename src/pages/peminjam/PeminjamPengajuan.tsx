import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Calendar, MapPin, FileText, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { formatRupiah } from '@/lib/utils';
import { RefundButton } from '@/components/refund/RefundButton';
import { Trash2, Edit, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PeminjamPengajuan: React.FC = () => {
  const { myPeminjaman, myPembayaran, userUpdatePeminjaman, userCancelPeminjaman, deletePeminjaman } = useData();
  const { toast } = useToast();
  const [editDialog, setEditDialog] = useState<any>(null);
  const [cancelDialog, setCancelDialog] = useState<number | null>(null);
  const [formData, setFormData] = useState({ tanggal_mulai: '', tanggal_selesai: '', tujuan_acara: '' });

  const handleEdit = async () => {
    if (!editDialog) return;
    if (await userUpdatePeminjaman(editDialog.id_peminjaman, formData)) {
      toast({ title: 'Pengajuan Diperbarui' });
      setEditDialog(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelDialog) return;
    if (await userCancelPeminjaman(cancelDialog)) {
      // Cek apakah ini refund
      const payment = myPembayaran.find(p => p.id_peminjaman === cancelDialog);
      if (payment && payment.status_pembayaran === 'berhasil') {
        toast({ title: 'Permintaan Refund Dikirim', description: 'Silakan tunggu persetujuan admin.' });
      } else {
        toast({ title: 'Pengajuan Dibatalkan' });
      }
      setCancelDialog(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold">Pengajuan <span className="gradient-text">Saya</span></h1>
          <p className="text-muted-foreground mt-1">Daftar semua pengajuan peminjaman Anda</p>
        </div>
        <Link to="/peminjam/gedung"><Button className="bg-gradient-primary hover:opacity-90 shadow-primary"><Building className="h-4 w-4 mr-2" />Pinjam Gedung Baru</Button></Link>
      </motion.div>

      {myPeminjaman.length > 0 ? (
        <div className="grid gap-4">
          {myPeminjaman.map((peminjaman, index) => {
            const payment = myPembayaran.find(p => p.id_peminjaman === peminjaman.id_peminjaman);
            const isRefund = payment?.status_pembayaran === 'refund_requested';
            const isRefunded = payment?.status_pembayaran === 'refunded';

            return (
              <motion.div key={peminjaman.id_peminjaman} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {peminjaman.gedung?.gambar ? (
                          <img src={peminjaman.gedung.gambar} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0"><Building className="h-7 w-7 text-primary-foreground" /></div>
                        )}
                        <div className="space-y-1">
                          <h3 className="font-poppins font-semibold text-lg">{peminjaman.gedung?.nama_gedung}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{peminjaman.gedung?.lokasi}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(new Date(peminjaman.tanggal_mulai), 'd MMM yyyy', { locale: id })} - {format(new Date(peminjaman.tanggal_selesai), 'd MMM yyyy', { locale: id })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Tujuan:</span><span>{peminjaman.tujuan_acara}</span></div>
                          {peminjaman.catatan_admin && (
                            <div className="mt-2 p-2 bg-muted/50 rounded-md border text-sm max-w-md">
                              <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Pesan dari Admin:</span>
                              <span className="italic">"{peminjaman.catatan_admin}"</span>
                            </div>
                          )}
                          {isRefund && <Badge className="mt-2 bg-purple-500">Refund Diproses</Badge>}
                          {isRefunded && <Badge className="mt-2 bg-slate-500">Dana Telah Direfund</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        {isRefund ? (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">Refund Requested</Badge>
                        ) : isRefunded ? (
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200">Refunded</Badge>
                        ) : (
                          <div className="flex flex-col items-end">
                            <StatusBadge status={peminjaman.status_peminjaman} />
                            {(peminjaman.status_peminjaman === 'menunggu' || (peminjaman.status_peminjaman === 'disetujui' && (!payment || payment.status_pembayaran !== 'berhasil'))) && peminjaman.batas_waktu_bayar && (
                              <div className="text-xs text-right mt-1">
                                <span className="text-muted-foreground mr-1">Batas Bayar:</span>
                                <span className={`font-medium ${new Date(peminjaman.batas_waktu_bayar) < new Date() ? 'text-destructive' : 'text-orange-500'}`}>
                                  {format(new Date(peminjaman.batas_waktu_bayar), 'd MMM HH:mm', { locale: id })}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {peminjaman.status_peminjaman === 'menunggu' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => {
                                setFormData({ tanggal_mulai: peminjaman.tanggal_mulai, tanggal_selesai: peminjaman.tanggal_selesai, tujuan_acara: peminjaman.tujuan_acara });
                                setEditDialog(peminjaman);
                              }}>Edit</Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setCancelDialog(peminjaman.id_peminjaman)}>Batal</Button>
                            </>
                          )}

                          {['dibatalkan', 'ditolak', 'selesai'].includes(peminjaman.status_peminjaman) && (
                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={async () => {
                              if (confirm('Hapus riwayat peminjaman ini?')) {
                                const res = await deletePeminjaman(peminjaman.id_peminjaman);
                                if (res.success) {
                                  toast({ title: 'Riwayat dihapus' });
                                } else {
                                  toast({ title: 'Gagal menghapus', description: res.message, variant: 'destructive' });
                                }
                              }
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                          {peminjaman.status_peminjaman === 'disetujui' && payment?.status_pembayaran === 'berhasil' && (
                            <RefundButton
                              id_peminjaman={peminjaman.id_peminjaman}
                              id_peminjam={peminjaman.id_peminjam}
                              harga_sewa={peminjaman.gedung?.harga_sewa || 0}
                              onSuccess={() => {
                                toast({ title: 'Refund berhasil diajukan', description: 'Silakan tunggu persetujuan admin.' });
                              }}
                            />
                          )}
                        </div>

                        {peminjaman.status_peminjaman === 'disetujui' && !payment && (
                          <Link to={`/peminjam/pembayaran/${peminjaman.id_peminjaman}`}>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90 gap-1"><CreditCard className="h-3 w-3" />Bayar</Button>
                          </Link>
                        )}
                        {payment && payment.status_pembayaran === 'berhasil' && !isRefund && !isRefunded && (
                          <Link to={`/peminjam/pembayaran/${peminjaman.id_peminjaman}`}>
                            <Button size="sm" variant="outline" className="gap-1"><CreditCard className="h-3 w-3" />Lihat Struk</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-card"><CardContent className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center"><FileText className="h-8 w-8 text-muted-foreground" /></div>
          <h3 className="font-semibold mb-2">Belum ada pengajuan</h3>
          <p className="text-muted-foreground text-sm mb-4">Anda belum mengajukan peminjaman gedung apapun</p>
          <Link to="/peminjam/gedung"><Button className="bg-gradient-primary hover:opacity-90">Mulai Pinjam Gedung</Button></Link>
        </CardContent></Card>
      )}

      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Pengajuan</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Mulai</Label><Input type="date" value={formData.tanggal_mulai} onChange={e => setFormData({ ...formData, tanggal_mulai: e.target.value })} /></div>
              <div className="space-y-1"><Label>Selesai</Label><Input type="date" value={formData.tanggal_selesai} onChange={e => setFormData({ ...formData, tanggal_selesai: e.target.value })} /></div>
            </div>
            <div><Label>Tujuan</Label><Textarea value={formData.tujuan_acara} onChange={e => setFormData({ ...formData, tujuan_acara: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={handleEdit}>Simpan Perubahan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Konfirmasi Pembatalan</DialogTitle></DialogHeader>
          <p>Apakah Anda yakin ingin membatalkan booking ini?</p>
          {myPembayaran.find(p => p.id_peminjaman === cancelDialog)?.status_pembayaran === 'berhasil' && (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-sm mt-2 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>Karena Anda sudah membayar, status booking akan berubah menjadi <b>Pengajuan Refund</b>. Admin akan memproses pengembalian dana Anda.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(null)}>Tidak</Button>
            <Button variant="destructive" onClick={handleCancel}>Ya, Batalkan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeminjamPengajuan;
