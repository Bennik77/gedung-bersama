import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminPeminjamPage: React.FC = () => {
  const { peminjamList } = useData();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama_peminjam: '',
    email: '',
    no_telepon: '',
    alamat: '',
    password: '',
  });

  const resetForm = () => {
    setFormData({
      nama_peminjam: '',
      email: '',
      no_telepon: '',
      alamat: '',
      password: '',
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowDialog(true);
  };

  const handleOpenEdit = (peminjam: any) => {
    setFormData({
      nama_peminjam: peminjam.nama_peminjam,
      email: peminjam.email,
      no_telepon: peminjam.no_telepon,
      alamat: peminjam.alamat,
      password: '',
    });
    setEditingId(peminjam.id_peminjam);
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama_peminjam || !formData.email || !formData.no_telepon || !formData.alamat) {
      toast({
        title: 'Error',
        description: 'Semua field wajib diisi',
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = editingId
        ? `http://localhost/pinjamgedungku-api/api/peminjam/update.php`
        : `http://localhost/pinjamgedungku-api/api/peminjam/create.php`;

      const payload = editingId
        ? { id_peminjam: editingId, ...formData }
        : formData;

      const method = editingId ? 'PUT' : 'POST';

      console.log('Sending request:', { url, method, payload });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      console.log('Response:', result);

      if (result.success) {
        toast({
          title: 'Sukses',
          description: editingId ? 'Peminjam berhasil diperbarui' : 'Peminjam berhasil ditambahkan',
        });
        setShowDialog(false);
        resetForm();
        // Refresh data - bisa pakai context method jika ada
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Terjadi kesalahan',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengakses server',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const response = await fetch(`http://localhost/pinjamgedungku-api/api/peminjam/delete.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_peminjam: deletingId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sukses',
          description: 'Peminjam berhasil dihapus',
        });
        setDeletingId(null);
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Terjadi kesalahan',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengakses server',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold">Kelola <span className="gradient-text">Peminjam</span></h1>
          <p className="text-muted-foreground mt-1">Daftar semua peminjam terdaftar ({peminjamList.length} peminjam)</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-gradient-primary hover:opacity-90 gap-2">
          <Plus className="h-4 w-4" />
          Tambah Peminjam
        </Button>
      </motion.div>

      <div className="grid gap-4">
        {peminjamList.length > 0 ? (
          peminjamList.map((p, i) => (
            <motion.div key={p.id_peminjam} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold text-lg">{p.nama_peminjam.charAt(0)}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{p.nama_peminjam}</h3>
                          {p.is_verified ? (
                            <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Terverifikasi</Badge>
                          ) : (
                            <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Belum Verifikasi</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.no_telepon}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.alamat}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => setDeletingId(p.id_peminjam)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Tidak ada peminjam terdaftar</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Peminjam' : 'Tambah Peminjam Baru'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nama Peminjam *</Label>
              <Input
                value={formData.nama_peminjam}
                onChange={(e) => setFormData({ ...formData, nama_peminjam: e.target.value })}
                placeholder="Nama lengkap"
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                disabled={!!editingId}
              />
            </div>

            <div>
              <Label>No. Telepon *</Label>
              <Input
                value={formData.no_telepon}
                onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                placeholder="08XX XXX XXXX"
              />
            </div>

            <div>
              <Label>Alamat *</Label>
              <Textarea
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Alamat lengkap"
              />
            </div>

            {!editingId && (
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                />
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Peminjam'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peminjam?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus peminjam dan semua data terkaitnya. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPeminjamPage;
