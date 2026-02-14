import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gedung } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { RatingDisplay } from '@/components/ulasan/RatingDisplay';
import { ULASAN_API } from '@/lib/ulasan-constants';

interface GedungCardProps {
  gedung: Gedung;
  showAction?: boolean;
  onBook?: () => void;
}

export const GedungCard: React.FC<GedungCardProps> = ({ gedung, showAction = true, onBook }) => {
  const [ratingAvg, setRatingAvg] = useState<number>(0);
  const [totalUlasan, setTotalUlasan] = useState<number>(0);
  const [isLoadingRating, setIsLoadingRating] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          ULASAN_API.RATING_AVERAGE(gedung.id_gedung)
        );
        const result = await response.json();
        if (result.success && result.data) {
          setRatingAvg(parseFloat(result.data.average_rating) || 0);
          setTotalUlasan(parseInt(result.data.total_ulasan) || 0);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      } finally {
        setIsLoadingRating(false);
      }
    };

    if (gedung.id_gedung) {
      fetchRating();
    }
  }, [gedung.id_gedung]);
  return (
    <Link to={`/gedung/${gedung.id_gedung}`} className="block no-underline">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full cursor-pointer">
          <div className="h-40 relative overflow-hidden">
            {gedung.gambar ? (
              <img src={gedung.gambar} alt={gedung.nama_gedung} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center">
                <Building className="h-12 w-12 text-primary-foreground/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
              <Badge variant={gedung.status === 'tersedia' ? 'default' : 'secondary'} className={gedung.status === 'tersedia' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                {gedung.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
              </Badge>
              <span className="text-xs text-white font-medium">{formatRupiah(gedung.harga_sewa)}</span>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-poppins font-semibold text-lg line-clamp-1 flex-1">{gedung.nama_gedung}</h3>
              {!isLoadingRating && totalUlasan > 0 && (
                <div className="ml-2 flex items-center gap-1">
                  <RatingDisplay rating={ratingAvg} size="sm" showText={false} />
                  <span className="text-xs font-semibold text-gray-600">{ratingAvg.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({totalUlasan})</span>
                </div>
              )}
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5 flex-shrink-0" /><span className="line-clamp-1">{gedung.lokasi}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-3.5 w-3.5 flex-shrink-0" /><span>Kapasitas: {gedung.kapasitas} orang</span></div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{gedung.deskripsi}</p>

            {showAction && gedung.status === 'tersedia' && onBook && (
              <Button size="sm" className="w-full bg-gradient-primary hover:opacity-90" onClick={(e) => {
                e.preventDefault();
                onBook();
              }}>Pinjam Sekarang</Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
