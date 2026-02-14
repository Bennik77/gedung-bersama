-- Script untuk mengubah password admin
-- Jalankan di phpMyAdmin atau MySQL client

-- Update password admin menjadi "password"
UPDATE petugas 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@peminjaman.id';

-- Password hash di atas adalah hasil dari: password_hash('password', PASSWORD_DEFAULT)
-- Password baru: password

-- Verifikasi perubahan
SELECT id_petugas, nama_petugas, email, 'password' as password_baru 
FROM petugas 
WHERE email = 'admin@peminjaman.id';
