<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_peminjaman'] ?? 0;
$tanggal_mulai = $input['tanggal_mulai'] ?? '';
$tanggal_selesai = $input['tanggal_selesai'] ?? '';
$tujuan_acara = $input['tujuan_acara'] ?? '';

if (empty($id)) response(false, "ID wajib diisi");

try {
    // Cek kepemilikan
    $stmt = $conn->prepare("SELECT id_peminjam, status_peminjaman FROM peminjaman WHERE id_peminjaman = ?");
    $stmt->execute([$id]);
    $booking = $stmt->fetch();

    if (!$booking || $booking['id_peminjam'] != $_SESSION['user']['id_peminjam']) {
        response(false, "Akses ditolak");
    }

    if ($booking['status_peminjaman'] !== 'menunggu') {
        response(false, "Hanya status Menunggu yang bisa diedit");
    }

    $stmt = $conn->prepare("UPDATE peminjaman SET tanggal_mulai = ?, tanggal_selesai = ?, tujuan_acara = ? WHERE id_peminjaman = ?");
    $stmt->execute([$tanggal_mulai, $tanggal_selesai, $tujuan_acara, $id]);
    
    response(true, "Pengajuan berhasil diperbarui");
} catch (PDOException $e) {
    response(false, "Gagal update: " . $e->getMessage());
}
?>
