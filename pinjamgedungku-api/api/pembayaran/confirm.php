<?php
require_once '../../config/koneksi.php';
require_once '../../config/email.php';

session_start();

// Validasi request (bisa dari frontend simulator)
$input = json_decode(file_get_contents("php://input"), true);
$id_pembayaran = $input['id_pembayaran'] ?? 0;
$status = $input['status'] ?? ''; // 'berhasil' atau 'gagal'

if (empty($id_pembayaran) || empty($status)) {
    response(false, "ID Pembayaran dan Status wajib diisi");
}

try {
    // 1. Update Status Pembayaran
    $stmt = $conn->prepare("UPDATE pembayaran SET status_pembayaran = ?, tanggal_pembayaran = NOW() WHERE id_pembayaran = ?");
    $stmt->execute([$status, $id_pembayaran]);

    if ($status === 'berhasil') {
        // 2. Ambil Data Lengkap (User, Gedung, Petugas Koordinator)
        $stmt = $conn->prepare("
            SELECT 
                p.kode_booking, p.jumlah, p.tanggal_pembayaran, p.metode_pembayaran,
                pem.tanggal_mulai, pem.tanggal_selesai, pem.tujuan_acara,
                m.nama_peminjam, m.email as email_peminjam, m.no_telepon as telp_peminjam,
                g.nama_gedung, g.lokasi,
                pt.nama_petugas as nama_koordinator, pt.email as email_koordinator, pt.no_telepon as telp_koordinator
            FROM pembayaran p
            JOIN peminjaman pem ON p.id_peminjaman = pem.id_peminjaman
            JOIN peminjam m ON pem.id_peminjam = m.id_peminjam
            JOIN gedung g ON pem.id_gedung = g.id_gedung
            LEFT JOIN petugas pt ON g.koordinator_id = pt.id_petugas
            WHERE p.id_pembayaran = ?
        ");
        $stmt->execute([$id_pembayaran]);
        $data = $stmt->fetch();

        if ($data) {
            $formattedJumlah = "Rp " . number_format($data['jumlah'], 0, ',', '.');
            $koordinatorInfo = $data['nama_koordinator'] 
                ? "{$data['nama_koordinator']} ({$data['telp_koordinator']})" 
                : "Admin Pusat (081234567890)";

            // --- EMAIL 1: KE USER (Struk & Info Petugas) ---
            sendReceiptEmail($data['email_peminjam'], $data);

            // --- EMAIL 2: KE ADMIN (Notifikasi Uang Masuk) ---
            // SKIPPED: Admin tidak memerlukan notifikasi email untuk pembayaran.

            // --- EMAIL 3: KE PETUGAS KOORDINATOR (Tugas Baru) ---
            if ($data['email_koordinator']) {
                sendTaskEmail($data['email_koordinator'], $data);
            }
        }
    }

    response(true, "Status pembayaran diperbarui", [
        "status" => $status,
        "koordinator" => $data['nama_koordinator'] ?? 'Admin Pusat',
        "telp_koordinator" => $data['telp_koordinator'] ?? '081234567890'
    ]);
} catch (PDOException $e) {
    response(false, "Error: " . $e->getMessage());
}
?>
