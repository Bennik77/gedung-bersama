

export interface Peminjam {
  id_peminjam: number;
  nama_peminjam: string;
  no_telepon: string;
  email: string;
  alamat: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface Gedung {
  id_gedung: number;
  nama_gedung: string;
  lokasi: string;
  kapasitas: number;
  harga_sewa: number;
  fasilitas: string;
  status: 'tersedia' | 'tidak_tersedia';
  deskripsi: string;
  gambar: string | null;
  koordinator_id?: number | null;
  nama_koordinator?: string;
  created_at: string;
  updated_at: string;
}

export interface Petugas {
  id_petugas: number;
  nama_petugas: string;
  jabatan: string;
  no_telepon: string;
  email: string;
  password?: string;
  foto?: string;
  created_at: string;
  updated_at: string;
}

export interface Peminjaman {
  id_peminjaman: number;
  id_peminjam: number;
  id_gedung: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tujuan_acara: string;
  status_peminjaman: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';
  created_at: string;
  updated_at: string;

  catatan_admin?: string;
  batas_waktu_bayar?: string | null;
}

export interface Persetujuan {
  id_persetujuan: number;
  id_peminjaman: number;
  id_petugas: number;
  tanggal_persetujuan: string;
  keterangan: string;
  created_at: string;

  peminjaman?: Peminjaman;
  petugas?: Petugas;
}

export interface Pembayaran {
  id_pembayaran: number;
  id_peminjaman: number;
  jumlah: number;
  metode_pembayaran: 'qris' | 'transfer_bank';
  status_pembayaran: 'pending' | 'berhasil' | 'gagal' | 'refund_requested' | 'refunded';
  kode_booking: string;
  bukti_pembayaran: string | null;
  tanggal_pembayaran: string | null;
  created_at: string;
  updated_at: string;
  // Relasi
  peminjaman?: Peminjaman;
  // QRIS Dummy
  qr_string?: string;
}


export type UserRole = 'peminjam' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  nama: string;
  role: UserRole;
  no_telepon?: string;
  alamat?: string;
  jabatan?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nama_peminjam: string;
  email: string;
  password: string;
  no_telepon: string;
  alamat: string;
}


export interface DashboardStats {
  totalGedung: number;
  totalPeminjam: number;
  totalPeminjaman: number;
  peminjamanMenunggu: number;
  peminjamanDisetujui: number;
  peminjamanDitolak: number;
}


export interface GedungFilter {
  search?: string;
  status?: 'tersedia' | 'tidak_tersedia' | 'semua';
  kapasitasMin?: number;
  kapasitasMax?: number;
  lokasi?: string;
}


export interface PengajuanForm {
  id_gedung: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tujuan_acara: string;
}

export interface GedungForm {
  nama_gedung: string;
  lokasi: string;
  kapasitas: number;
  harga_sewa: number;
  fasilitas: string;
  status: 'tersedia' | 'tidak_tersedia';
  deskripsi: string;
  gambar?: string | null;
  koordinator_id?: number | null;
}

export interface PetugasForm {
  nama_petugas: string;
  jabatan: string;
  no_telepon: string;
  email: string;
  foto?: string;
  password?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}


export interface Notifikasi {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
