import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#fbbf24', '#22c55e', '#ef4444'];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getStats, peminjamanList, gedungList, pendingPeminjaman, getPeminjam, getGedung } = useData();
  
  const stats = getStats();

  const pieData = [
    { name: 'Menunggu', value: stats.peminjamanMenunggu },
    { name: 'Disetujui', value: stats.peminjamanDisetujui },
    { name: 'Ditolak', value: stats.peminjamanDitolak },
  ];

  // Get top 5 popular gedung
  const gedungPopularity = gedungList.map(g => ({
    name: g.nama_gedung.substring(0, 15) + '...',
    peminjaman: peminjamanList.filter(p => p.id_gedung === g.id_gedung).length,
  })).sort((a, b) => b.peminjaman - a.peminjaman).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-poppins text-2xl md:text-3xl font-bold">
          Dashboard <span className="gradient-text">Admin</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang, {user?.nama}. Berikut ringkasan sistem.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gedung"
          value={stats.totalGedung}
          icon={Building}
          variant="primary"
        />
        <StatCard
          title="Total Peminjam"
          value={stats.totalPeminjam}
          icon={Users}
        />
        <StatCard
          title="Total Peminjaman"
          value={stats.totalPeminjaman}
          icon={FileText}
        />
        <StatCard
          title="Menunggu Persetujuan"
          value={stats.peminjamanMenunggu}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Status Peminjaman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Gedung Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gedungPopularity}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="peminjaman" fill="hsl(243 75% 59%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Menunggu Persetujuan</CardTitle>
          {pendingPeminjaman.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {pendingPeminjaman.length} pengajuan
            </span>
          )}
        </CardHeader>
        <CardContent>
          {pendingPeminjaman.length > 0 ? (
            <div className="space-y-3">
              {pendingPeminjaman.slice(0, 5).map((peminjaman) => (
                <div 
                  key={peminjaman.id_peminjaman}
                  className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{peminjaman.gedung?.nama_gedung}</p>
                      <p className="text-xs text-muted-foreground">
                        Oleh: {peminjaman.peminjam?.nama_peminjam} • 
                        {format(new Date(peminjaman.tanggal_mulai), ' d MMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={peminjaman.status_peminjaman} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50 text-success" />
              <p>Tidak ada pengajuan yang menunggu</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
