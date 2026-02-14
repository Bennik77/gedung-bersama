import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Users, Search, Plus, Pencil, Trash2, Loader2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { GedungForm } from '@/types';
import { formatRupiah } from '@/lib/utils';

const emptyForm: GedungForm = { nama_gedung: '', lokasi: '', kapasitas: 0, harga_sewa: 0, fasilitas: '', status: 'tersedia', deskripsi: '' };

const AdminGedungPage: React.FC = () => {
  const { gedungList, addGedung, updateGedung, deleteGedung } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<GedungForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = gedungList.filter(g => g.nama_gedung.toLowerCase().includes(search.toLowerCase()) || g.lokasi.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditId(null); setFormData(emptyForm); setDialogOpen(true); };
  const openEdit = (g: typeof gedungList[0]) => {
    setEditId(g.id_gedung);
    setFormData({ nama_gedung: g.nama_gedung, lokasi: g.lokasi, kapasitas: g.kapasitas, harga_sewa: g.harga_sewa, fasilitas: g.fasilitas, status: g.status, deskripsi: g.deskripsi, gambar: g.gambar, koordinator_id: g.koordinator_id });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = editId ? await updateGedung(editId, formData) : await addGedung(formData);
    if (success) { toast({ title: editId ? 'Gedung diperbarui' : 'Gedung ditambahkan', description: 'Data berhasil disimpan.' }); setDialogOpen(false); }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteGedung(id);
    if (success) toast({ title: 'Gedung dihapus', description: 'Data gedung berhasil dihapus.' });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold">Kelola <span className="gradient-text">Gedung</span></h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, dan hapus data gedung</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-primary gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Tambah Gedung
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit Gedung' : 'Tambah Gedung Baru'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Nama Gedung</Label><Input value={formData.nama_gedung} onChange={e => setFormData({ ...formData, nama_gedung: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Lokasi</Label><Input value={formData.lokasi} onChange={e => setFormData({ ...formData, lokasi: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Kapasitas</Label><Input type="number" value={formData.kapasitas} onChange={e => setFormData({ ...formData, kapasitas: parseInt(e.target.value) || 0 })} required /></div>
                <div className="space-y-2"><Label>Harga Sewa (Rp)</Label><Input type="number" value={formData.harga_sewa} onChange={e => setFormData({ ...formData, harga_sewa: parseInt(e.target.value) || 0 })} required /></div>
              </div>
              <div className="space-y-2"><Label>Fasilitas</Label><Input value={formData.fasilitas} onChange={e => setFormData({ ...formData, fasilitas: e.target.value })} placeholder="AC, Proyektor, Wi-Fi" /></div>
              <div className="space-y-2"><Label>URL Gambar</Label><Input value={formData.gambar || ''} onChange={e => setFormData({ ...formData, gambar: e.target.value })} placeholder="https://example.com/image.jpg" /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="tersedia">Tersedia</SelectItem><SelectItem value="tidak_tersedia">Tidak Tersedia</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Penanggung Jawab (Koordinator)</Label>
                <Select value={formData.koordinator_id?.toString() || "0"} onValueChange={v => setFormData({ ...formData, koordinator_id: v === "0" ? null : parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Petugas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">-- Tidak Ada --</SelectItem>
                    {/* @ts-ignore */}
                    {useData().petugasList.map(p => (
                      <SelectItem key={p.id_petugas} value={p.id_petugas.toString()}>{p.nama_petugas}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Deskripsi</Label><Textarea value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} className="min-h-[80px]" required /></div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : (editId ? 'Simpan Perubahan' : 'Tambah Gedung')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari gedung..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4">
        {filtered.map((gedung, i) => (
          <motion.div key={gedung.id_gedung} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {gedung.gambar ? (
                      <img src={gedung.gambar} alt={gedung.nama_gedung} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0"><Building className="h-8 w-8 text-primary-foreground" /></div>
                    )}
                    <div className="space-y-1">
                      <h3 className="font-poppins font-semibold text-lg">{gedung.nama_gedung}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{gedung.lokasi}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{gedung.kapasitas} orang</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatRupiah(gedung.harga_sewa)}</span>
                      </div>
                      <Badge variant={gedung.status === 'tersedia' ? 'default' : 'secondary'} className={gedung.status === 'tersedia' ? 'bg-success text-success-foreground' : ''}>
                        {gedung.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => openEdit(gedung)}><Pencil className="h-3 w-3" />Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" />Hapus</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Hapus Gedung?</AlertDialogTitle><AlertDialogDescription>Gedung "{gedung.nama_gedung}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(gedung.id_gedung)} className="bg-destructive text-destructive-foreground">Hapus</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default AdminGedungPage;
