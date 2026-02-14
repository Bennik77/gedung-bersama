import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Calendar, MapPin, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getGedung, createPeminjaman } = useData();
  
  const gedung = getGedung(Number(id));
  
  const [formData, setFormData] = useState({
    tanggal_mulai: '',
    tanggal_selesai: '',
    tujuan_acara: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!gedung) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Gedung tidak ditemukan</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (new Date(formData.tanggal_selesai) < new Date(formData.tanggal_mulai)) {
      toast({
        title: 'Tanggal tidak valid',
        description: 'Tanggal selesai harus setelah tanggal mulai.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const success = await createPeminjaman({
      id_gedung: gedung.id_gedung,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      tujuan_acara: formData.tujuan_acara,
    });

    if (success) {
      toast({
        title: 'Pengajuan berhasil!',
        description: 'Pengajuan peminjaman Anda sedang diproses.',
      });
      navigate('/peminjam/pengajuan');
    } else {
      toast({
        title: 'Gagal mengajukan',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Gedung Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informasi Gedung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              {gedung.gambar ? (
                <img src={gedung.gambar} alt={gedung.nama_gedung} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center"><Building className="h-16 w-16 text-primary-foreground/50" /></div>
              )}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl mb-2">{gedung.nama_gedung}</h2>
              <Badge variant={gedung.status === 'tersedia' ? 'default' : 'secondary'}>
                {gedung.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{gedung.lokasi}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Kapasitas: {gedung.kapasitas} orang</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{gedung.deskripsi}</p>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Form Pengajuan Peminjaman</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tanggal_mulai"
                      name="tanggal_mulai"
                      type="date"
                      value={formData.tanggal_mulai}
                      onChange={handleChange}
                      className="pl-10"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tanggal_selesai"
                      name="tanggal_selesai"
                      type="date"
                      value={formData.tanggal_selesai}
                      onChange={handleChange}
                      className="pl-10"
                      min={formData.tanggal_mulai || format(new Date(), 'yyyy-MM-dd')}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tujuan_acara">Tujuan Acara</Label>
                <Textarea
                  id="tujuan_acara"
                  name="tujuan_acara"
                  placeholder="Jelaskan tujuan peminjaman gedung..."
                  value={formData.tujuan_acara}
                  onChange={handleChange}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 shadow-primary"
                disabled={isLoading || gedung.status !== 'tersedia'}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Ajukan Peminjaman'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookingPage;
