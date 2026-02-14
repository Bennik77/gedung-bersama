import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Shield, 
  Sparkles,
  ChevronRight,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GedungCard } from '@/components/gedung/GedungCard';
import { useData } from '@/contexts/DataContext';
import heroBuilding from '@/assets/hero-building.jpg';

const features = [
  {
    icon: Clock,
    title: 'Proses Cepat',
    description: 'Pengajuan peminjaman diproses dalam waktu singkat dengan notifikasi real-time.',
  },
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Data Anda dilindungi dengan sistem keamanan standar industri.',
  },
  {
    icon: CheckCircle,
    title: 'Mudah Digunakan',
    description: 'Antarmuka yang intuitif untuk kemudahan peminjaman gedung.',
  },
  {
    icon: Sparkles,
    title: 'Fasilitas Lengkap',
    description: 'Berbagai pilihan gedung dengan fasilitas yang lengkap dan modern.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Daftar Akun',
    description: 'Buat akun gratis untuk mulai menggunakan layanan kami.',
  },
  {
    number: '02',
    title: 'Pilih Gedung',
    description: 'Jelajahi katalog gedung dan pilih yang sesuai kebutuhan.',
  },
  {
    number: '03',
    title: 'Ajukan Peminjaman',
    description: 'Isi formulir pengajuan dengan tanggal dan tujuan acara.',
  },
  {
    number: '04',
    title: 'Tunggu Persetujuan',
    description: 'Tim kami akan memproses pengajuan Anda dengan cepat.',
  },
];

const LandingPage: React.FC = () => {
  const { gedungList } = useData();
  const featuredGedung = gedungList.filter(g => g.status === 'tersedia').slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroBuilding} 
            alt="Hero Building" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm mb-6">
                <Sparkles className="h-4 w-4" />
                Platform Peminjaman Gedung #1 di Indonesia
              </span>
              
              <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight">
                Pinjam Gedung
                <span className="block text-primary">Lebih Mudah</span>
              </h1>
              
              <p className="text-lg text-background/80 mb-8 max-w-lg">
                Temukan dan pinjam gedung serbaguna untuk berbagai acara Anda. 
                Proses cepat, mudah, dan terpercaya.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-primary gap-2 w-full sm:w-auto">
                    Mulai Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/gedung">
                  <Button size="lg" variant="outline" className="bg-background/10 border-background/30 text-background hover:bg-background/20 w-full sm:w-auto">
                    Lihat Gedung
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-poppins font-bold text-background">10+</p>
                  <p className="text-sm text-background/70">Gedung Tersedia</p>
                </div>
                <div>
                  <p className="text-3xl font-poppins font-bold text-background">50+</p>
                  <p className="text-sm text-background/70">Peminjaman Sukses</p>
                </div>
                <div>
                  <p className="text-3xl font-poppins font-bold text-background">100%</p>
                  <p className="text-sm text-background/70">Kepuasan Pelanggan</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-background/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-background/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
              Mengapa Memilih <span className="gradient-text">PinjamGedungku</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami menyediakan layanan peminjaman gedung terbaik dengan berbagai keunggulan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-primary">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-poppins font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Buildings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
                Gedung <span className="gradient-text">Unggulan</span>
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Pilihan gedung terbaik kami untuk berbagai kebutuhan acara Anda
              </p>
            </div>
            <Link to="/gedung" className="mt-4 md:mt-0">
              <Button variant="ghost" className="gap-2 text-primary">
                Lihat Semua <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGedung.map((gedung, index) => (
              <motion.div
                key={gedung.id_gedung}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GedungCard gedung={gedung} showAction={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
              Cara <span className="gradient-text">Peminjaman</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ikuti langkah-langkah mudah berikut untuk meminjam gedung
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-primary">
                    <span className="font-poppins font-bold text-xl text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="relative z-10 py-16 px-8 md:px-16 text-center">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Siap Meminjam Gedung?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Daftar sekarang dan nikmati kemudahan peminjaman gedung serbaguna dengan PinjamGedungku
              </p>
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-background/90 gap-2"
                >
                  Daftar Gratis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
