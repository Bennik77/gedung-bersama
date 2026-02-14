import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GedungCard } from '@/components/gedung/GedungCard';
import { useData } from '@/contexts/DataContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const GedungPublicList: React.FC = () => {
  const { filteredGedung, gedungFilter, setGedungFilter } = useData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-poppins text-3xl font-bold mb-2">Daftar <span className="gradient-text">Gedung</span></h1>
            <p className="text-muted-foreground">Temukan gedung serbaguna untuk acara Anda</p>
          </motion.div>
          
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari gedung..."
              value={gedungFilter.search || ''}
              onChange={(e) => setGedungFilter({ ...gedungFilter, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGedung.map((gedung) => (
              <GedungCard key={gedung.id_gedung} gedung={gedung} showAction={false} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GedungPublicList;
