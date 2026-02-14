import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, Clock, XCircle, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatCard } from '@/components/dashboard/StatCard';
import { AdminRefundList } from '@/components/refund/AdminRefundList';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';

import { Trash2, Edit, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminPembayaranPage: React.FC = () => {
  const { pembayaranList, peminjamanList, confirmPembayaran, updatePembayaran, deletePembayaran, processRefund, getStats, getGedung, getPeminjam } = useData();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [viewReceipt, setViewReceipt] = useState<any | null>(null);
  const [actionDialog, setActionDialog] = useState<{ id: number; action: 'edit' | 'delete' | 'refund' } | null>(null);
  const [editForm, setEditForm] = useState({ jumlah: 0, status_pembayaran: '', metode_pembayaran: '' });
  const [isLoading, setIsLoading] = useState(false);

  const stats = getStats();

  const enriched = pembayaranList.map(p => {
    const peminjaman = peminjamanList.find(pm => pm.id_peminjaman === p.id_peminjaman);
    return { ...p, peminjaman, gedung: peminjaman && getGedung(peminjaman.id_gedung), peminjam: peminjaman && getPeminjam(peminjaman.id_peminjam) };
  });

  const filtered = statusFilter === 'semua' ? enriched : enriched.filter(p => p.status_pembayaran === statusFilter);

  const handleConfirm = async (id: number) => {
    if (await confirmPembayaran(id)) toast({ title: 'Pembayaran Dikonfirmasi' });
  };

  const openEdit = (p: any) => {
    setEditForm({ jumlah: p.jumlah, status_pembayaran: p.status_pembayaran, metode_pembayaran: p.metode_pembayaran });
    setActionDialog({ id: p.id_pembayaran, action: 'edit' });
  };

  const handleAction = async () => {
    if (!actionDialog) return;
    setIsLoading(true);
    let success = false;

    if (actionDialog.action === 'edit') success = await updatePembayaran(actionDialog.id, editForm);
    else if (actionDialog.action === 'delete') success = await deletePembayaran(actionDialog.id);

    if (success) {
      toast({ title: 'Berhasil' });
      setActionDialog(null);
    }
    setIsLoading(false);
  };

  const handleRefund = async (approve: boolean) => {
    if (!actionDialog) return;
    setIsLoading(true);
    const success = await processRefund(actionDialog.id, approve ? 'approve' : 'reject');
    if (success) {
      toast({ title: approve ? 'Refund Disetujui' : 'Refund Ditolak' });
      setActionDialog(null);
      setTimeout(() => window.location.reload(), 1000);
    }
    setIsLoading(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'berhasil': return <Badge className="bg-success text-success-foreground">Berhasil</Badge>;
      case 'pending': return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'gagal': return <Badge className="bg-destructive text-destructive-foreground">Gagal</Badge>;
      case 'refund_requested': return <Badge className="bg-purple-500 text-white">Refund Req</Badge>;
      case 'refunded': return <Badge className="bg-slate-500 text-white">Refunded</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-poppins text-2xl md:text-3xl font-bold">Kelola <span className="gradient-text">Pembayaran</span></h1>
        <p className="text-muted-foreground mt-1">Pantau, konfirmasi, dan refund pembayaran</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pendapatan" value={formatRupiah(stats.totalPendapatan)} icon={DollarSign} variant="success" />
        <StatCard title="Pembayaran Berhasil" value={pembayaranList.filter(p => p.status_pembayaran === 'berhasil').length} icon={CheckCircle} />
        <StatCard title="Menunggu Konfirmasi" value={pembayaranList.filter(p => p.status_pembayaran === 'pending').length} icon={Clock} variant="warning" />
        <StatCard title="Request Refund" value={pembayaranList.filter(p => p.status_pembayaran === 'refund_requested').length} icon={RefreshCcw} variant="destructive" />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="berhasil">Berhasil</SelectItem>
          <SelectItem value="gagal">Gagal</SelectItem>
          <SelectItem value="refund_requested">Refund</SelectItem>
        </SelectContent>
      </Select>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Booking</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Gedung</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id_pembayaran}>
                    <TableCell className="font-mono text-sm">{p.kode_booking}</TableCell>
                    <TableCell>{p.peminjam?.nama_peminjam || '-'}</TableCell>
                    <TableCell>{p.gedung?.nama_gedung || '-'}</TableCell>
                    <TableCell className="font-medium">{formatRupiah(p.jumlah)}</TableCell>
                    <TableCell>{statusBadge(p.status_pembayaran)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {p.status_pembayaran === 'pending' && (
                          <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => handleConfirm(p.id_pembayaran)}>Konfirmasi</Button>
                        )}
                        {p.status_pembayaran === 'refund_requested' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => setActionDialog({ id: p.id_pembayaran, action: 'refund' })}>Proses Refund</Button>
                        )}
                        {p.status_pembayaran === 'berhasil' && (
                          <Button size="sm" variant="outline" onClick={() => setViewReceipt(p)}>Struk</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setActionDialog({ id: p.id_pembayaran, action: 'delete' })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewReceipt} onOpenChange={(open) => !open && setViewReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Bukti Pembayaran</DialogTitle></DialogHeader>
          <p className="text-center text-muted-foreground">Detail Pembayaran ID: {viewReceipt?.kode_booking}</p>
        </DialogContent>
      </Dialog>

      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>
            {actionDialog?.action === 'edit' && 'Edit Pembayaran'}
            {actionDialog?.action === 'delete' && 'Hapus Pembayaran'}
            {actionDialog?.action === 'refund' && 'Proses Pengajuan Refund'}
          </DialogTitle></DialogHeader>

          {actionDialog?.action === 'delete' && <p>Yakin hapus data pembayaran ini?</p>}

          {actionDialog?.action === 'edit' && (
            <div className="space-y-2">
              <div><Label>Jumlah</Label><Input type="number" value={editForm.jumlah} onChange={e => setEditForm({ ...editForm, jumlah: Number(e.target.value) })} /></div>
              <div><Label>Status</Label>
                <Select value={editForm.status_pembayaran} onValueChange={v => setEditForm({ ...editForm, status_pembayaran: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="berhasil">Berhasil</SelectItem><SelectItem value="gagal">Gagal</SelectItem><SelectItem value="refunded">Refunded</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}

          {actionDialog?.action === 'refund' && (
            <div className="space-y-4">
              <p>User mengajukan refund. Pastikan Anda sudah menerima konfirmasi transfer balik (jika manual).</p>
              <div className="flex gap-2">
                <Button className="w-1/2 bg-success" onClick={() => handleRefund(true)}>Setujui Refund</Button>
                <Button className="w-1/2" variant="destructive" onClick={() => handleRefund(false)}>Tolak</Button>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            {actionDialog?.action !== 'refund' && (
              <>
                <Button variant="outline" onClick={() => setActionDialog(null)} className="mr-2">Batal</Button>
                <Button onClick={handleAction} variant={actionDialog?.action === 'delete' ? 'destructive' : 'default'}>Simpan</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>


      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <AdminRefundList />
      </motion.div>
    </div>
  );
};

export default AdminPembayaranPage;
