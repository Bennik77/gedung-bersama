import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, Loader2, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';


import { Trash2, Edit } from 'lucide-react';

const AdminPeminjamanPage: React.FC = () => {
  const { peminjamanList, pembayaranList, approvePeminjaman, rejectPeminjaman, updatePeminjaman, deletePeminjaman, getGedung, getPeminjam } = useData();
  const { toast } = useToast();

  const isPaid = (peminjamanId: number) => {
    return pembayaranList.some(p => p.id_peminjaman === peminjamanId && p.status_pembayaran === 'berhasil');
  };

  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [actionDialog, setActionDialog] = useState<{ id: number; action: 'approve' | 'reject' | 'delete' | 'edit' } | null>(null);
  const [keterangan, setKeterangan] = useState('');

  const [editForm, setEditForm] = useState({ tanggal_mulai: '', tanggal_selesai: '', tujuan_acara: '', id_gedung: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const allPeminjaman = peminjamanList.map(p => ({
    ...p,
    gedung: getGedung(p.id_gedung),
    peminjam: getPeminjam(p.id_peminjam),
  }));

  const filtered = statusFilter === 'semua' ? allPeminjaman : allPeminjaman.filter(p => p.status_peminjaman === statusFilter);

  const openEdit = (p: any) => {
    setEditForm({
      tanggal_mulai: p.tanggal_mulai,
      tanggal_selesai: p.tanggal_selesai,
      tujuan_acara: p.tujuan_acara,
      id_gedung: p.id_gedung
    });
    setActionDialog({ id: p.id_peminjaman, action: 'edit' });
  };

  const handleAction = async () => {
    if (!actionDialog) return;
    setIsLoading(true);
    let success = false;

    if (actionDialog.action === 'delete') {
      const res = await deletePeminjaman(actionDialog.id);
      if (res.success) {
        toast({ title: 'Berhasil', description: 'Data penghapusan berhasil.' });
        setActionDialog(null);
      } else {
        toast({ title: 'Gagal', description: res.message, variant: 'destructive' });
      }
      setIsLoading(false);
      return;
    }

    if (actionDialog.action === 'approve') success = await approvePeminjaman(actionDialog.id, keterangan);
    else if (actionDialog.action === 'reject') success = await rejectPeminjaman(actionDialog.id, keterangan);
    else if (actionDialog.action === 'edit') success = await updatePeminjaman(actionDialog.id, editForm);

    if (success) {
      toast({ title: 'Berhasil', description: 'Aksi berhasil dilakukan.' });
      setActionDialog(null); setKeterangan('');
    } else {
      toast({ title: 'Gagal', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-poppins text-2xl md:text-3xl font-bold">Kelola <span className="gradient-text">Peminjaman</span></h1>
        <p className="text-muted-foreground mt-1">Setujui, tolak, atau kelola data peminjaman</p>
      </motion.div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Status</SelectItem>
          <SelectItem value="menunggu">Menunggu</SelectItem>
          <SelectItem value="disetujui">Disetujui</SelectItem>
          <SelectItem value="ditolak">Ditolak</SelectItem>
          <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid gap-4">
        {filtered.map((p, i) => {
          const payment = pembayaranList.find(py => py.id_peminjaman === p.id_peminjaman);
          const isRefund = payment?.status_pembayaran === 'refund_requested';
          const isRefunded = payment?.status_pembayaran === 'refunded';

          return (
            <motion.div key={p.id_peminjaman} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Building className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{p.gedung?.nama_gedung}</h3>
                        <p className="text-sm text-muted-foreground">Peminjam: <span className="font-medium text-foreground">{p.peminjam?.nama_peminjam}</span></p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(p.tanggal_mulai), 'd MMM yyyy', { locale: idLocale })} - {format(new Date(p.tanggal_selesai), 'd MMM yyyy', { locale: idLocale })}
                        </p>
                        <p className="text-sm text-muted-foreground">Tujuan: {p.tujuan_acara}</p>
                        {p.catatan_admin && (
                          <div className="mt-2 p-2 bg-muted rounded-md border text-sm">
                            <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Catatan Admin:</span>
                            {p.catatan_admin}
                          </div>
                        )}
                        {isRefund && <Badge className="mt-1 bg-purple-500 hover:bg-purple-600">Refund Requested</Badge>}
                        {isRefunded && <Badge className="mt-1 bg-slate-500">Refunded</Badge>}
                        {(p.status_peminjaman === 'menunggu' || (p.status_peminjaman === 'disetujui' && !isPaid(p.id_peminjaman))) && p.batas_waktu_bayar && (
                          <div className="mt-1 text-sm">
                            <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Batas Bayar:</span>
                            <span className={`text-xs ${new Date(p.batas_waktu_bayar) < new Date() ? 'text-red-500 font-bold' : 'text-orange-500'}`}>
                              {format(new Date(p.batas_waktu_bayar), 'dd MMM HH:mm', { locale: idLocale })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={p.status_peminjaman} />
                      <div className="flex gap-2 mt-2">
                        {p.status_peminjaman === 'menunggu' ? (
                          <>
                            <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90 h-8 px-2" onClick={() => { setActionDialog({ id: p.id_peminjaman, action: 'approve' }); setKeterangan(''); }}>
                              <CheckCircle className="h-3 w-3 mr-1" /> Setujui
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive h-8 px-2" onClick={() => { setActionDialog({ id: p.id_peminjaman, action: 'reject' }); setKeterangan(''); }}>
                              <XCircle className="h-3 w-3 mr-1" /> Tolak
                            </Button>
                          </>
                        ) : null}

                        {isRefund && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8 px-2" onClick={() => window.location.href = '/admin/pembayaran'}>
                            Proses Refund
                          </Button>
                        )}

                        <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => openEdit(p)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-8 px-2" onClick={() => setActionDialog({ id: p.id_peminjaman, action: 'delete' })}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="shadow-card"><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" /><p className="text-muted-foreground">Tidak ada data peminjaman</p></CardContent></Card>
        )}
      </div>

      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>
            {actionDialog?.action === 'approve' && 'Setujui Peminjaman'}
            {actionDialog?.action === 'reject' && 'Tolak Peminjaman'}
            {actionDialog?.action === 'delete' && 'Hapus Peminjaman'}
            {actionDialog?.action === 'edit' && 'Edit Data Peminjaman'}
          </DialogTitle></DialogHeader>

          <div className="space-y-4">
            {(actionDialog?.action === 'approve' || actionDialog?.action === 'reject') && (
              <div className="space-y-2"><Label>Keterangan</Label><Textarea value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Masukkan keterangan..." className="min-h-[100px]" /></div>
            )}

            {actionDialog?.action === 'delete' && (
              <p className="text-sm text-destructive font-medium">Apakah Anda yakin ingin menghapus data ini secara permanen?</p>
            )}

            {actionDialog?.action === 'edit' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><Label>Mulai</Label><Input type="date" value={editForm.tanggal_mulai} onChange={e => setEditForm({ ...editForm, tanggal_mulai: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Selesai</Label><Input type="date" value={editForm.tanggal_selesai} onChange={e => setEditForm({ ...editForm, tanggal_selesai: e.target.value })} /></div>
                </div>
                <div className="space-y-1"><Label>Tujuan</Label><Textarea value={editForm.tujuan_acara} onChange={e => setEditForm({ ...editForm, tujuan_acara: e.target.value })} /></div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>Batal</Button>
            <Button onClick={handleAction} disabled={isLoading} variant={actionDialog?.action === 'delete' || actionDialog?.action === 'reject' ? 'destructive' : 'default'}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPeminjamanPage;
