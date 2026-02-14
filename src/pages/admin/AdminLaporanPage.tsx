import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, DollarSign, Building, FileText, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatCard } from '@/components/dashboard/StatCard';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AdminLaporanPage: React.FC = () => {
  const { peminjamanList, getStats, gedungList, getGedung, getPeminjam } = useData();
  const stats = getStats();
  const [periodeFilter, setPeriodeFilter] = useState<string>('semua');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

  // Filter Data
  const filteredPeminjaman = peminjamanList.filter(p => {
    if (periodeFilter === 'semua') return true;
    const d = new Date(p.created_at);
    return d.getMonth() + 1 === parseInt(periodeFilter) && d.getFullYear() === parseInt(yearFilter);
  }).map(p => ({
    ...p, gedung: getGedung(p.id_gedung), peminjam: getPeminjam(p.id_peminjam),
  }));

  // Monthly data for chart based on year filter
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthPeminjaman = peminjamanList.filter(p => {
      const d = new Date(p.created_at);
      return d.getMonth() + 1 === month && d.getFullYear() === parseInt(yearFilter);
    });
    return {
      bulan: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i],
      total: monthPeminjaman.length,
      disetujui: monthPeminjaman.filter(p => p.status_peminjaman === 'disetujui').length,
      ditolak: monthPeminjaman.filter(p => p.status_peminjaman === 'ditolak').length,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Basic CSV Export
    const headers = ['No', 'Peminjam', 'Gedung', 'Tanggal Mulai', 'Tanggal Selesai', 'Tujuan', 'Status', 'Total Biaya'];
    const rows = filteredPeminjaman.map((p, i) => [
      i + 1,
      p.peminjam?.nama_peminjam || '-',
      p.gedung?.nama_gedung || '-',
      p.tanggal_mulai,
      p.tanggal_selesai,
      `"${p.tujuan_acara}"`, // Quote to handle commas
      p.status_peminjaman,
      p.gedung?.harga_sewa || 0 // Simplified
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan_peminjaman_${yearFilter}_${periodeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold">Laporan <span className="gradient-text">Peminjaman</span></h1>
          <p className="text-muted-foreground mt-1">Ringkasan dan rekap data peminjaman</p>
        </div>

        <div className="flex gap-2 no-print">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={periodeFilter} onValueChange={setPeriodeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Bulan</SelectItem>
              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Cetak PDF
          </Button>
          <Button variant="default" className="bg-gradient-primary" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Print Header */}
      <div className="print-only mb-8 text-center hidden">
        <h2 className="text-2xl font-bold">Laporan Peminjaman Gedung</h2>
        <p>Gedung Bersama / PinjamGedungku</p>
        <p className="text-sm text-gray-500">
          Periode: {periodeFilter === 'semua' ? 'Semua Bulan' : format(new Date(parseInt(yearFilter), parseInt(periodeFilter) - 1), 'MMMM', { locale: idLocale })} {yearFilter}
        </p>
        <hr className="my-4 border-gray-300" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print-grid">
        <StatCard title="Total Peminjaman" value={filteredPeminjaman.length} icon={FileText} variant="primary" />
        <StatCard title="Disetujui" value={filteredPeminjaman.filter(p => p.status_peminjaman === 'disetujui').length} icon={Building} variant="success" />
        <StatCard title="Ditolak" value={filteredPeminjaman.filter(p => p.status_peminjaman === 'ditolak').length} icon={BarChart3} variant="warning" />
        <StatCard title="Est. Pendapatan" value={formatRupiah(filteredPeminjaman.filter(p => p.status_peminjaman === 'disetujui').reduce((acc, curr) => acc + Number(curr.gedung?.harga_sewa || 0), 0))} icon={DollarSign} />
      </div>

      <Card className="shadow-card no-print">
        <CardHeader><CardTitle>Tren Peminjaman per Bulan ({yearFilter})</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total" fill="hsl(243 75% 59%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disetujui" name="Disetujui" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ditolak" name="Ditolak" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card print-border">
        <CardHeader className="no-print"><CardTitle>Riwayat Peminjaman</CardTitle></CardHeader>
        <CardContent>
          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Gedung</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tujuan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeminjaman.length > 0 ? (
                  filteredPeminjaman.map((p, i) => (
                    <TableRow key={p.id_peminjaman}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">
                        {p.peminjam?.nama_peminjam}
                        <span className="block text-xs text-muted-foreground">{p.peminjam?.email}</span>
                      </TableCell>
                      <TableCell>{p.gedung?.nama_gedung}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(p.tanggal_mulai), 'd MMM yyyy', { locale: idLocale })}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate print:whitespace-normal">{p.tujuan_acara}</TableCell>
                      <TableCell><StatusBadge status={p.status_peminjaman} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada data peminjaman untuk periode ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="print-only mt-8 flex justify-end">
        <div className="text-center pr-10">
          <p>Jakarta, {format(new Date(), 'd MMMM yyyy', { locale: idLocale })}</p>
          <p className="mt-16 font-bold">( Admin Sistem )</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanPage;
