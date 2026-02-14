import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GedungCard } from '@/components/gedung/GedungCard';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PeminjamGedungList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { filteredGedung, gedungFilter, setGedungFilter } = useData();

  const handleBooking = (gedungId: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Silakan login terlebih dahulu',
        description: 'Anda harus login untuk mengajukan peminjaman.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    navigate(`/peminjam/gedung/${gedungId}/booking`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-poppins text-2xl md:text-3xl font-bold">
          Daftar <span className="gradient-text">Gedung</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Temukan gedung yang sesuai untuk acara Anda
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari gedung..."
            value={gedungFilter.search || ''}
            onChange={(e) => setGedungFilter({ ...gedungFilter, search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Select
          value={gedungFilter.status || 'semua'}
          onValueChange={(value) => setGedungFilter({ 
            ...gedungFilter, 
            status: value as any
          })}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="tersedia">Tersedia</SelectItem>
            <SelectItem value="tidak_tersedia">Tidak Tersedia</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={gedungFilter.kapasitasMin?.toString() || '0'}
          onValueChange={(value) => setGedungFilter({ 
            ...gedungFilter, 
            kapasitasMin: value === '0' ? undefined : parseInt(value)
          })}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Kapasitas Min" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Semua Kapasitas</SelectItem>
            <SelectItem value="50">Min. 50 orang</SelectItem>
            <SelectItem value="100">Min. 100 orang</SelectItem>
            <SelectItem value="200">Min. 200 orang</SelectItem>
            <SelectItem value="500">Min. 500 orang</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredGedung.length} gedung
      </div>

      {/* Gedung Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGedung.map((gedung, index) => (
          <motion.div
            key={gedung.id_gedung}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GedungCard 
              gedung={gedung} 
              onBook={() => handleBooking(gedung.id_gedung)}
            />
          </motion.div>
        ))}
      </div>

      {filteredGedung.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Tidak ada gedung ditemukan</h3>
          <p className="text-muted-foreground text-sm">
            Coba ubah filter pencarian Anda
          </p>
        </div>
      )}
    </div>
  );
};

export default PeminjamGedungList;
