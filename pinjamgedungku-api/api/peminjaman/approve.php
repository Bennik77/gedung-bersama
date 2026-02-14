<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);

$id_peminjaman = $input['id_peminjaman'] ?? 0;
$keterangan = $input['keterangan'] ?? 'Disetujui';

try {
    $conn->beginTransaction();
    
    // Update status
    $stmt = $conn->prepare("UPDATE peminjaman SET status_peminjaman = 'disetujui' WHERE id_peminjaman = ?");
    $stmt->execute([$id_peminjaman]);
    
    // Insert persetujuan
    $stmt = $conn->prepare("
        INSERT INTO persetujuan (id_peminjaman, id_petugas, tanggal_persetujuan, keterangan) 
        VALUES (?, ?, NOW(), ?)
    ");
    $stmt->execute([$id_peminjaman, $_SESSION['user']['id_petugas'], $keterangan]);
    
    $conn->commit();
    response(true, "Peminjaman berhasil disetujui");
} catch (Exception $e) {
    $conn->rollBack();
    response(false, "Gagal menyetujui: " . $e->getMessage());
}
?>
