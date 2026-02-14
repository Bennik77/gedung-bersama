import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import {
  Gedung, Peminjam, Petugas, Peminjaman, Pembayaran,
  GedungFilter, PengajuanForm, GedungForm, PetugasForm, Notifikasi
} from '@/types';
import { fetchApi } from '@/lib/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  gedungList: Gedung[];
  filteredGedung: Gedung[];
  gedungFilter: GedungFilter;
  setGedungFilter: (filter: GedungFilter) => void;
  getGedung: (id: number) => Gedung | undefined;
  addGedung: (data: GedungForm) => Promise<boolean>;
  updateGedung: (id: number, data: GedungForm) => Promise<boolean>;
  deleteGedung: (id: number) => Promise<boolean>;
  peminjamList: Peminjam[];
  getPeminjam: (id: number) => Peminjam | undefined;
  petugasList: Petugas[];
  addPetugas: (data: PetugasForm) => Promise<boolean>;
  updatePetugas: (id: number, data: PetugasForm) => Promise<boolean>;
  deletePetugas: (id: number) => Promise<boolean>;
  peminjamanList: Peminjaman[];
  myPeminjaman: Peminjaman[];
  pendingPeminjaman: Peminjaman[];
  createPeminjaman: (data: PengajuanForm) => Promise<boolean>;
  approvePeminjaman: (id: number, keterangan: string) => Promise<boolean>;
  rejectPeminjaman: (id: number, keterangan: string) => Promise<boolean>;
  rejectPeminjaman: (id: number, keterangan: string) => Promise<boolean>;
  rejectPeminjaman: (id: number, keterangan: string) => Promise<boolean>;
  updatePeminjaman: (id: number, data: any) => Promise<boolean>;
  deletePeminjaman: (id: number) => Promise<{ success: boolean; message: string }>;
  userUpdatePeminjaman: (id: number, data: any) => Promise<boolean>;
  userCancelPeminjaman: (id: number) => Promise<boolean>;
  pembayaranList: Pembayaran[];
  myPembayaran: Pembayaran[];
  createPembayaran: (id_peminjaman: number, metode: 'qris' | 'transfer_bank') => Promise<Pembayaran | null>;
  confirmPembayaran: (id: number, status?: 'berhasil' | 'gagal') => Promise<boolean>;
  updatePembayaran: (id: number, data: any) => Promise<boolean>;
  deletePembayaran: (id: number) => Promise<boolean>;
  processRefund: (id: number, action: 'approve' | 'reject') => Promise<boolean>;
  notifikasi: Notifikasi[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  getStats: () => {
    totalGedung: number;
    totalPeminjam: number;
    totalPeminjaman: number;
    peminjamanMenunggu: number;
    peminjamanDisetujui: number;
    peminjamanDitolak: number;
    totalPendapatan: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [gedungList, setGedungList] = useState<Gedung[]>([]);
  const [peminjamList, setPeminjamList] = useState<Peminjam[]>([]);
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [gedungFilter, setGedungFilter] = useState<GedungFilter>({});

  const fetchData = async () => {
    const resGedung = await fetchApi<Gedung[]>('gedung/list.php');
    if (resGedung.success) setGedungList(resGedung.data);

    if (user) {
      const resPeminjaman = await fetchApi<Peminjaman[]>('peminjaman/list.php');
      if (resPeminjaman.success) setPeminjamanList(resPeminjaman.data);

      const resPembayaran = await fetchApi<Pembayaran[]>('pembayaran/list.php');
      if (resPembayaran.success) setPembayaranList(resPembayaran.data);

      if (user.role === 'admin') {
        const resPeminjam = await fetchApi<Peminjam[]>('peminjam/list.php');
        if (resPeminjam.success) setPeminjamList(resPeminjam.data);

        const resPetugas = await fetchApi<Petugas[]>('petugas/list.php');
        if (resPetugas.success) setPetugasList(resPetugas.data);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredGedung = gedungList.filter(gedung => {
    if (gedungFilter.search) {
      const search = gedungFilter.search.toLowerCase();
      if (!gedung.nama_gedung.toLowerCase().includes(search) && !gedung.lokasi.toLowerCase().includes(search)) return false;
    }
    if (gedungFilter.status && gedungFilter.status !== 'semua') {
      if (gedung.status !== gedungFilter.status) return false;
    }
    if (gedungFilter.kapasitasMin && gedung.kapasitas < gedungFilter.kapasitasMin) return false;
    if (gedungFilter.kapasitasMax && gedung.kapasitas > gedungFilter.kapasitasMax) return false;
    return true;
  });

  const getGedungById = (id: number) => gedungList.find(g => g.id_gedung === id);
  const getPeminjamById = (id: number) => peminjamList.find(p => p.id_peminjam === id);

  const myPeminjaman = peminjamanList
    .filter(p => user?.role === 'peminjam' && p.id_peminjam === user.id)
    .map(p => ({ ...p, gedung: getGedungById(p.id_gedung), peminjam: getPeminjamById(p.id_peminjam) }));

  const pendingPeminjaman = peminjamanList
    .filter(p => p.status_peminjaman === 'menunggu')
    .map(p => ({ ...p, gedung: getGedungById(p.id_gedung), peminjam: getPeminjamById(p.id_peminjam) }));

  const myPembayaran = pembayaranList
    .filter(p => {
      const peminjaman = peminjamanList.find(pm => pm.id_peminjaman === p.id_peminjaman);
      return user?.role === 'peminjam' && peminjaman?.id_peminjam === user.id;
    })
    .map(p => {
      const peminjaman = peminjamanList.find(pm => pm.id_peminjaman === p.id_peminjaman);
      return { ...p, peminjaman: peminjaman ? { ...peminjaman, gedung: getGedungById(peminjaman.id_gedung) } : undefined };
    });

  const unreadCount = notifikasi.filter(n => !n.read).length;

  const getGedung = useCallback((id: number) => gedungList.find(g => g.id_gedung === id), [gedungList]);
  const getPeminjam = useCallback((id: number) => peminjamList.find(p => p.id_peminjam === id), [peminjamList]);

  const addGedung = async (data: GedungForm): Promise<boolean> => {
    const res = await fetchApi('gedung/create.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const updateGedung = async (id: number, data: GedungForm): Promise<boolean> => {
    const res = await fetchApi('gedung/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_gedung: id, ...data })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const deleteGedung = async (id: number): Promise<boolean> => {
    const res = await fetchApi(`gedung/delete.php?id=${id}`);
    if (res.success) {
      setGedungList(prev => prev.filter(g => g.id_gedung !== id));
      return true;
    }
    return false;
  };

  const addPetugas = async (data: PetugasForm): Promise<boolean> => {
    const res = await fetchApi('petugas/create.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const updatePetugas = async (id: number, data: PetugasForm): Promise<boolean> => {
    const res = await fetchApi('petugas/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_petugas: id, ...data })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const deletePetugas = async (id: number): Promise<boolean> => {
    const res = await fetchApi(`petugas/delete.php?id=${id}`);
    if (res.success) {
      setPetugasList(prev => prev.filter(p => p.id_petugas !== id));
      return true;
    }
    return false;
  };

  const createPeminjaman = async (data: PengajuanForm): Promise<boolean> => {
    if (!user) return false;
    
    const payload = {
      ...data,
      tanggal_mulai: typeof data.tanggal_mulai === 'string' ? data.tanggal_mulai : data.tanggal_mulai.toISOString().split('T')[0],
      tanggal_selesai: typeof data.tanggal_selesai === 'string' ? data.tanggal_selesai : data.tanggal_selesai.toISOString().split('T')[0]
    };
    
    console.log('Sending peminjaman:', payload);
    
    const res = await fetchApi('peminjaman/create.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log('Peminjaman response:', res);
    
    if (res.success) {
      fetchData();
      setNotifikasi(prev => [{ id: prev.length + 1, type: 'info', title: 'Pengajuan Dikirim', message: `Pengajuan peminjaman sedang dalam proses verifikasi.`, read: false, created_at: new Date().toISOString() }, ...prev]);
      return true;
    }
    return false;
  };

  const approvePeminjaman = async (id: number, keterangan: string): Promise<boolean> => {
    const res = await fetchApi('peminjaman/approve.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_peminjaman: id, keterangan })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const rejectPeminjaman = async (id: number, keterangan: string): Promise<boolean> => {
    const res = await fetchApi('peminjaman/reject.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_peminjaman: id, keterangan })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const createPembayaran = async (id_peminjaman: number, metode: 'qris' | 'transfer_bank'): Promise<Pembayaran | null> => {
    const peminjaman = peminjamanList.find(p => p.id_peminjaman === id_peminjaman);
    if (!peminjaman) return null;
    const gedung = getGedung(peminjaman.id_gedung);
    if (!gedung) return null;

    const res = await fetchApi<Pembayaran>('pembayaran/create.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_peminjaman,
        metode_pembayaran: metode,
        jumlah: gedung.harga_sewa || 0 // Assuming harga_sewa exists, if not need to check types
      })
    });

    if (res.success && res.data) {
      fetchData();
      setPembayaranList(prev => [...prev, res.data!]);
      return res.data;
    }
    return null;
  };

  const confirmPembayaran = async (id: number, status: 'berhasil' | 'gagal' = 'berhasil'): Promise<boolean> => {
    const res = await fetchApi('pembayaran/confirm.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pembayaran: id, status })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const updatePeminjaman = async (id: number, data: any): Promise<boolean> => {
    const res = await fetchApi('peminjaman/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_peminjaman: id, ...data })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const deletePeminjaman = async (id: number): Promise<{ success: boolean; message: string }> => {
    const res = await fetchApi(`peminjaman/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_peminjaman: id })
    });
    if (res.success) {
      fetchData();
    }
    return { success: res.success, message: res.message || (res.success ? 'Berhasil' : 'Gagal') };
  };

  const userUpdatePeminjaman = async (id: number, data: any): Promise<boolean> => {
    const res = await fetchApi('peminjaman/user_update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_peminjaman: id, ...data })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const userCancelPeminjaman = async (id: number): Promise<boolean> => {
    const res = await fetchApi('peminjaman/user_cancel.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_peminjaman: id })
    });
    if (res.success) {
      await fetchData();
      return true;
    }
    return false;
  };

  const updatePembayaran = async (id: number, data: any): Promise<boolean> => {
    const res = await fetchApi('pembayaran/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pembayaran: id, ...data })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const deletePembayaran = async (id: number): Promise<boolean> => {
    const res = await fetchApi(`pembayaran/delete.php?id=${id}`);
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const processRefund = async (id: number, action: 'approve' | 'reject'): Promise<boolean> => {
    const res = await fetchApi('pembayaran/process_refund.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pembayaran: id, action })
    });
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const markAsRead = (id: number) => { setNotifikasi(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); };

  const getStats = useCallback(() => ({
    totalGedung: gedungList.length,
    totalPeminjam: peminjamList.length,
    totalPeminjaman: peminjamanList.length,
    peminjamanMenunggu: peminjamanList.filter(p => p.status_peminjaman === 'menunggu').length,
    peminjamanDisetujui: peminjamanList.filter(p => p.status_peminjaman === 'disetujui').length,
    peminjamanDitolak: peminjamanList.filter(p => p.status_peminjaman === 'ditolak').length,
    totalPendapatan: pembayaranList.filter(p => p.status_pembayaran === 'berhasil').reduce((sum, p) => sum + Number(p.jumlah), 0),
  }), [gedungList, peminjamList, peminjamanList, pembayaranList]);

  return (
    <DataContext.Provider value={{
      gedungList, filteredGedung, gedungFilter, setGedungFilter, getGedung, addGedung, updateGedung, deleteGedung,
      peminjamList, getPeminjam, petugasList, addPetugas, updatePetugas, deletePetugas,
      peminjamanList, myPeminjaman, pendingPeminjaman, createPeminjaman, approvePeminjaman, rejectPeminjaman, updatePeminjaman, deletePeminjaman, userUpdatePeminjaman, userCancelPeminjaman,
      pembayaranList, myPembayaran, createPembayaran, confirmPembayaran, updatePembayaran, deletePembayaran, processRefund,
      notifikasi, unreadCount, markAsRead, getStats,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
