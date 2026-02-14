import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCog, Plus, Pencil, Trash2, Loader2, Mail, Phone, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { PetugasForm } from '@/types';

const emptyForm: PetugasForm = { nama_petugas: '', jabatan: '', no_telepon: '', email: '', foto: '' };

const AdminPetugasPage: React.FC = () => {
  const { petugasList, addPetugas, updatePetugas, deletePetugas } = useData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PetugasForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);

  const openCreate = () => { setEditId(null); setFormData(emptyForm); setDialogOpen(true); };
  const openEdit = (p: typeof petugasList[0]) => { setEditId(p.id_petugas); setFormData({ nama_petugas: p.nama_petugas, jabatan: p.jabatan, no_telepon: p.no_telepon, email: p.email, foto: p.foto }); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    const success = editId ? await updatePetugas(editId, formData) : await addPetugas(formData);
    if (success) {
      toast({ title: editId ? 'Petugas diperbarui' : 'Petugas berhasil ditambahkan' });
      setDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan petugas",
        description: "Periksa koneksi atau pastikan email belum terdaftar."
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (await deletePetugas(id)) toast({ title: 'Petugas dihapus' });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold">Kelola <span className="gradient-text">Petugas Lapangan</span></h1>
          <p className="text-muted-foreground mt-1">Tambah petugas untuk menjadi penanggung jawab gedung</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-primary hover:opacity-90 shadow-primary gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Tambah Petugas</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit Petugas' : 'Tambah Petugas Baru'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Nama Petugas</Label><Input value={formData.nama_petugas} onChange={e => setFormData({ ...formData, nama_petugas: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Foto (URL)</Label><Input value={formData.foto || ''} onChange={e => setFormData({ ...formData, foto: e.target.value })} placeholder="https://example.com/foto.jpg" /></div>
              <div className="space-y-2"><Label>Jabatan</Label><Input value={formData.jabatan} onChange={e => setFormData({ ...formData, jabatan: e.target.value })} required /></div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  WAJIB gunakan email asli! Email dummy tidak akan menerima notifikasi tugas.
                </p>
              </div>
              <div className="space-y-2"><Label>No. Telepon</Label><Input value={formData.no_telepon} onChange={e => setFormData({ ...formData, no_telepon: e.target.value })} required /></div>
              <DialogFooter><Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{editId ? 'Simpan' : 'Tambah'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-4">
        {Array.isArray(petugasList) && petugasList.map((p, i) => (
          <motion.div key={p.id_petugas} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.foto ? (
                        <img src={p.foto} alt={p.nama_petugas} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-foreground font-bold text-lg">{p.nama_petugas.charAt(0)}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{p.nama_petugas}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />{p.jabatan}</Badge>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.no_telepon}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {p.id_petugas > 2 && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" />Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" />Hapus</Button></AlertDialogTrigger>
                          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Petugas?</AlertDialogTitle><AlertDialogDescription>Petugas "{p.nama_petugas}" akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id_petugas)} className="bg-destructive text-destructive-foreground">Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {p.id_petugas <= 2 && <Badge variant="secondary" className="opacity-70 bg-slate-200 text-slate-700">Administrator Sistem (Protected)</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPetugasPage;
