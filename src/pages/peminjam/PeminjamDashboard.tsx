import React from 'react';
import { motion } from 'framer-motion';
import { Building, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PeminjamDashboard: React.FC = () => {
  const { user } = useAuth();
  const { myPeminjaman, gedungList } = useData();

  const stats = {
    totalPengajuan: myPeminjaman.length,
    menunggu: myPeminjaman.filter(p => p.status_peminjaman === 'menunggu').length,
    disetujui: myPeminjaman.filter(p => p.status_peminjaman === 'disetujui').length,
    ditolak: myPeminjaman.filter(p => p.status_peminjaman === 'ditolak').length,
  };

  const recentPeminjaman = myPeminjaman.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-poppins text-2xl md:text-3xl font-bold">
          Selamat Datang, <span className="gradient-text">{user?.nama}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola peminjaman gedung Anda dengan mudah
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengajuan"
          value={stats.totalPengajuan}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Menunggu"
          value={stats.menunggu}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Disetujui"
          value={stats.disetujui}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Gedung Tersedia"
          value={gedungList.filter(g => g.status === 'tersedia').length}
          icon={Building}
        />
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/peminjam/gedung">
              <Button className="w-full justify-start gap-3 bg-gradient-primary hover:opacity-90">
                <Building className="h-5 w-5" />
                Cari Gedung
              </Button>
            </Link>
            <Link to="/peminjam/pengajuan">
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileText className="h-5 w-5" />
                Lihat Pengajuan
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Peminjaman */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pengajuan Terbaru</CardTitle>
            <Link to="/peminjam/pengajuan">
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPeminjaman.length > 0 ? (
              <div className="space-y-3">
                {recentPeminjaman.map((peminjaman) => (
                  <div 
                    key={peminjaman.id_peminjaman}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{peminjaman.gedung?.nama_gedung}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(peminjaman.tanggal_mulai), 'd MMM yyyy', { locale: id })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={peminjaman.status_peminjaman} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada pengajuan</p>
                <Link to="/peminjam/gedung">
                  <Button variant="link" className="mt-2">Mulai Pinjam Gedung</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeminjamDashboard;
