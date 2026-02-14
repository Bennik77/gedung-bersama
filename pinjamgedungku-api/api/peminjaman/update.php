<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_peminjaman'] ?? 0;
$tanggal_mulai = $input['tanggal_mulai'] ?? '';
$tanggal_selesai = $input['tanggal_selesai'] ?? '';
$tujuan_acara = $input['tujuan_acara'] ?? '';
$id_gedung = $input['id_gedung'] ?? 0;

if (empty($id) || empty($tanggal_mulai) || empty($tanggal_selesai)) {
    response(false, "Data tidak lengkap");
}

try {
    $stmt = $conn->prepare("UPDATE peminjaman SET id_gedung = ?, tanggal_mulai = ?, tanggal_selesai = ?, tujuan_acara = ? WHERE id_peminjaman = ?");
    $stmt->execute([$id_gedung, $tanggal_mulai, $tanggal_selesai, $tujuan_acara, $id]);
    
    response(true, "Data peminjaman diperbarui");
} catch (PDOException $e) {
    response(false, "Gagal update: " . $e->getMessage());
}
?>
