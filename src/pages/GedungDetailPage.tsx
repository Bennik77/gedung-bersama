import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Users, DollarSign, FileText } from 'lucide-react';
import { Gedung } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { RatingForm } from '@/components/ulasan/RatingForm';
import { UlasanList } from '@/components/ulasan/UlasanList';
import { RatingStats } from '@/components/ulasan/RatingStats';
import { RatingDisplay } from '@/components/ulasan/RatingDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ULASAN_API, PEMINJAMAN_STATUS_FOR_RATING } from '@/lib/ulasan-constants';

interface Ulasan {
  id_ulasan: number;
  id_peminjaman: number;
  id_peminjam: number;
  id_gedung: number;
  rating: number;
  teks_ulasan: string;
  created_at: string;
  nama_peminjam: string;
  nama_gedung?: string;
}

interface RatingStatsData {
  average_rating: number;
  total_ulasan: number;
  rating_5: number;
  rating_4: number;
  rating_3: number;
  rating_2: number;
  rating_1: number;
}

const GedungDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [gedung, setGedung] = useState<Gedung | null>(null);
  const [ulasans, setUlasans] = useState<Ulasan[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUlasan, setIsLoadingUlasan] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasRating, setUserHasRating] = useState(false);
  const [completedPeminjaman, setCompletedPeminjaman] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);


        const gedungRes = await fetch(
          `http://localhost/pinjamgedungku-api/api/gedung/detail.php?id_gedung=${id}`
        );
        const gedungData = await gedungRes.json();

        if (gedungData.success) {
          setGedung(gedungData.data);
        } else {
          setError('Gagal memuat data gedung');
        }


        setIsLoadingUlasan(true);
        const ulasanRes = await fetch(
          `${ULASAN_API.LIST()}?id_gedung=${id}`
        );
        const ulasanData = await ulasanRes.json();

        console.log('Ulasan Response:', ulasanData);

        if (ulasanData.success) {
          setUlasans(ulasanData.data || []);
        } else {
          setUlasans([]);
        }
        setIsLoadingUlasan(false);


        const ratingRes = await fetch(
          ULASAN_API.RATING_AVERAGE(parseInt(id!))
        );
        const ratingData = await ratingRes.json();

        if (ratingData.success) {
          setRatingStats(ratingData.data);
        }


        if (user?.id && user.role === 'peminjam') {
          const userRating = ulasanData.data?.find((u: any) => u.id_peminjam === user.id);
          setUserHasRating(!!userRating);


          const peminjamanRes = await fetch(
            `http://localhost/pinjamgedungku-api/api/peminjaman/list.php?id_peminjam=${user.id}&id_gedung=${id}`
          );
          const peminjamanData = await peminjamanRes.json();

          if (peminjamanData.success) {
            const completed = peminjamanData.data.filter(
              (p: any) => p.status_peminjaman === PEMINJAMAN_STATUS_FOR_RATING
            );
            setCompletedPeminjaman(completed);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Terjadi kesalahan saat memuat data');
        toast({
          title: 'Error',
          description: 'Gagal memuat data gedung',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user, toast]);

  const handleRatingSubmit = async (rating: number, teks_ulasan: string) => {
    if (!user?.id || user.role !== 'peminjam' || !completedPeminjaman[0]) {
      toast({
        title: 'Error',
        description: 'Data peminjaman tidak ditemukan',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        ULASAN_API.CREATE(),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_peminjaman: completedPeminjaman[0].id_peminjaman,
            id_peminjam: user.id,
            id_gedung: parseInt(id!),
            rating,
            teks_ulasan,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sukses',
          description: 'Ulasan Anda berhasil dibuat',
        });


        setUserHasRating(true);


        const ulasanRes = await fetch(
          `${ULASAN_API.LIST()}?id_gedung=${id}`
        );
        const ulasanData = await ulasanRes.json();
        if (ulasanData.success) {
          setUlasans(ulasanData.data);
        }

        const ratingRes = await fetch(
          ULASAN_API.RATING_AVERAGE(parseInt(id!))
        );
        const ratingData = await ratingRes.json();
        if (ratingData.success) {
          setRatingStats(ratingData.data);
        }
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Gagal membuat ulasan',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat mengirim ulasan',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-96 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!gedung) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Gedung tidak ditemukan</p>
            <Button onClick={() => navigate('/')} className="mx-auto mt-4">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">

              <div className="h-96 rounded-lg overflow-hidden">
                {gedung.gambar ? (
                  <img
                    src={gedung.gambar}
                    alt={gedung.nama_gedung}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-primary-foreground/50" />
                  </div>
                )}
              </div>


              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {gedung.nama_gedung}
                      </CardTitle>
                      <Badge
                        variant={
                          gedung.status === 'tersedia' ? 'default' : 'secondary'
                        }
                      >
                        {gedung.status === 'tersedia'
                          ? 'Tersedia'
                          : 'Tidak Tersedia'}
                      </Badge>
                    </div>
                    {ratingStats && (
                      <div className="text-right">
                        <RatingDisplay
                          rating={
                            typeof ratingStats.average_rating === 'string'
                              ? parseFloat(ratingStats.average_rating) || 0
                              : ratingStats.average_rating || 0
                          }
                          size="lg"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {ratingStats.total_ulasan} ulasan
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Lokasi</span>
                      </div>
                      <p className="font-semibold">{gedung.lokasi}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Kapasitas</span>
                      </div>
                      <p className="font-semibold">{gedung.kapasitas} orang</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Harga Sewa</span>
                      </div>
                      <p className="font-semibold">
                        {formatRupiah(gedung.harga_sewa)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                    <p className="text-muted-foreground">{gedung.deskripsi}</p>
                  </div>

                  {gedung.fasilitas && (
                    <div>
                      <h3 className="font-semibold mb-2">Fasilitas</h3>
                      <div className="space-y-1">
                        {gedung.fasilitas
                          .split(',')
                          .map((fasilitas, index) => (
                            <p
                              key={index}
                              className="text-muted-foreground"
                            >
                              • {fasilitas.trim()}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>


              {ratingStats && ratingStats.total_ulasan > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RatingStats {...ratingStats} />
                  </CardContent>
                </Card>
              )}


              {user && completedPeminjaman.length > 0 && !userHasRating && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bagikan Pengalaman Anda</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Berikan ulasan untuk membantu calon peminjam lain
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RatingForm
                      onSubmit={handleRatingSubmit}
                      isLoading={isSubmitting}
                    />
                  </CardContent>
                </Card>
              )}

              {user && completedPeminjaman.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      Hanya dapat memberikan ulasan setelah peminjaman selesai
                    </p>
                  </CardContent>
                </Card>
              )}

              {!user && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      Silakan login untuk memberikan ulasan
                    </p>
                    <Button onClick={() => navigate('/auth/login')}>
                      Login
                    </Button>
                  </CardContent>
                </Card>
              )}


              <Card>
                <CardHeader>
                  <CardTitle>Ulasan Pengguna ({ulasans.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingUlasan ? (
                    <div className="space-y-3">
                      <div className="animate-pulse h-24 bg-muted rounded" />
                      <div className="animate-pulse h-24 bg-muted rounded" />
                    </div>
                  ) : ulasans.length > 0 ? (
                    <UlasanList ulasans={ulasans} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Belum ada ulasan untuk gedung ini. Jadilah yang pertama memberikan ulasan!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>


            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={() => navigate(`/peminjam/gedung/${id}/booking`)}
              >
                Pinjam Gedung Ini
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GedungDetailPage;
