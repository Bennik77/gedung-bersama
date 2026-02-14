# 🏛️ PinjamGedungku - Sistem Peminjaman Gedung Serbaguna

**Kelompok 7 - IF6 UNIKOM**

## 📖 Tentang Proyek
**PinjamGedungku** adalah sistem informasi berbasis web yang dirancang untuk memudahkan masyarakat dalam mencari dan menyewa gedung serbaguna secara digital. Sistem ini juga membantu pengelola gedung dalam mengelola jadwal, verifikasi persetujuan, dan pemantauan pembayaran.

### ✨ Fitur Unggulan
- **Pencarian & Booking Online**: Katalog gedung lengkap dengan filter dan ketersediaan.
- **Manajemen Peminjaman**: Pengajuan sewa dengan alur persetujuan admin.
- **Pembayaran Digital**: Integrasi simulasi pembayaran QRIS dan Transfer Bank dengan struk digital otomatis.
- **Notifikasi Email**: Pemberitahuan otomatis untuk status pengajuan dan bukti pembayaran.
- **Dashboard Admin Lengkap**: Statistik, manajemen gedung, persetujuan peminjaman, dan laporan.
- **Sistem Rating & Ulasan**: Pengguna dapat memberikan ulasan setelah peminjaman selesai.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Shadcn UI
- **Backend**: Native PHP (RESTful API), MySQL
- **Tools**: XAMPP (Apache/MySQL), Node.js, Git

---

## 🚀 Panduan Instalasi (Lokal)

### Prasyarat
Pastikan Anda telah menginstal:
1. **XAMPP** (atau Laragon) - untuk server PHP & MySQL.
2. **Node.js** (v16+) - untuk menjalankan frontend.
3. **Git** - untuk manajemen versi.

### Langkah 1: Setup Backend & Database
1.  **Siapkan Database**:
    - Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
    - Buat database baru dengan nama `peminjaman_gedung`.
    - Import file `peminjaman_gedung.sql` yang ada di root folder proyek ini.

2.  **Konfigurasi Backend**:
    - Salin folder `pinjamgedungku-api` ke dalam direktori `htdocs` XAMPP (biasanya `C:\xampp\htdocs\`).
    - Pastikan struktur akhirnya adalah: `C:\xampp\htdocs\pinjamgedungku-api\`.
    - Cek file `pinjamgedungku-api/config/koneksi.php` dan sesuaikan username/password database jika perlu.

### Langkah 2: Setup Frontend
1.  Buka terminal di root folder proyek ini (`gedung-bersama`).
2.  Install dependensi:
    ```bash
    npm install
    ```
3.  Jalankan server pengembangan:
    ```bash
    npm run dev
    ```
4.  Akses aplikasi melalui browser di `http://localhost:5173`.

---

## 🔐 Akun Demo
Gunakan akun berikut untuk mencoba fitur aplikasi:

| Role | Email | Password | Keterangan |
|------|-------|----------|------------|
| **Peminjam** | `budi@email.com` | `password123` | Akun pengguna umum |
| **Admin** | `admin@peminjaman.id` | `password` | Administrator sistem |
| **Petugas** | `ahmad@peminjaman.id` | `petugas123` | Petugas lapangan |

> **Catatan:** Untuk fitur OTP dan notifikasi email, disarankan mendaftar akun baru menggunakan **email asli** (Gmail/Yahoo) yang aktif.

---

---

## 📝 Catatan Tambahan
- **Troubleshooting**: Jika mengalami error CORS, pastikan backend berjalan di `localhost` dan konfigurasi `Access-Control-Allow-Origin` di backend sudah benar (sudah dikonfigurasi secara default).
- **Email**: Fitur pengiriman email menggunakan SMTP Gmail. Konfigurasi ada di `.env` (Frontend) dan `config/email.php` (Backend).

---

**Selamat Menggunakan PinjamGedungku! 🎉**
