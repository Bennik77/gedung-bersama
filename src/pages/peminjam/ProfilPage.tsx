import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchApi } from '@/lib/api';


const ProfilPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    no_telepon: user?.no_telepon || '',
    alamat: user?.alamat || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchApi('peminjam/update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_peminjam: user?.id,
          nama_peminjam: formData.nama,
          email: formData.email,
          no_telepon: formData.no_telepon,
          alamat: formData.alamat
        })
      });

      if (response.success) {

        /* @ts-ignore */
        if (response.data) {
          // @ts-ignore
          const newData = response.data;

          // @ts-ignore
          updateProfile(newData);
        }

        toast({ title: 'Profil Diperbarui', description: 'Data profil Anda berhasil disimpan.' });
      } else {
        toast({ title: 'Gagal', description: response.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan koneksi', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-poppins text-2xl md:text-3xl font-bold">Profil <span className="gradient-text">Saya</span></h1>
        <p className="text-muted-foreground mt-1">Edit data pribadi Anda</p>
      </motion.div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">{user?.nama.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <CardTitle>{user?.nama}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="nama"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>No. Telepon</Label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={e => setFormData({ ...formData, no_telepon: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alamat</Label>
              <div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                  className="pl-10 min-h-[80px]"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-primary gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>


    </div>
  );
};

export default ProfilPage;
