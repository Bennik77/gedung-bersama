<?php
require_once '../../config/koneksi.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$status = $_GET['status'] ?? 'pending'; // pending, approved, rejected, all

if ($status === 'all') {
    $query = "
        SELECT p.id_peminjaman, p.id_peminjam, p.id_gedung, 
               p.refund_status, p.refund_amount, p.refund_requested_at, 
               p.refund_approved_at, p.refund_notes, p.status_peminjaman,
               pm.nama_peminjam, pm.email as peminjam_email, pm.no_telepon,
               g.nama_gedung, g.harga_sewa
        FROM peminjaman p
        JOIN peminjam pm ON p.id_peminjam = pm.id_peminjam
        JOIN gedung g ON p.id_gedung = g.id_gedung
        WHERE p.refund_status IS NOT NULL
        ORDER BY p.refund_requested_at DESC
    ";
} else {
    $query = "
        SELECT p.id_peminjaman, p.id_peminjam, p.id_gedung, 
               p.refund_status, p.refund_amount, p.refund_requested_at, 
               p.refund_approved_at, p.refund_notes, p.status_peminjaman,
               pm.nama_peminjam, pm.email as peminjam_email, pm.no_telepon,
               g.nama_gedung, g.harga_sewa
        FROM peminjaman p
        JOIN peminjam pm ON p.id_peminjam = pm.id_peminjam
        JOIN gedung g ON p.id_gedung = g.id_gedung
        WHERE p.refund_status = ?
        ORDER BY p.refund_requested_at DESC
    ";
}

try {
    $stmt = $conn->prepare($query);
    
    if ($status !== 'all') {
        $stmt->execute([$status]);
    } else {
        $stmt->execute();
    }
    
    $refunds = $stmt->fetchAll();

    response(true, "Daftar refund berhasil diambil", $refunds);

} catch (Exception $e) {
    response(false, "Terjadi kesalahan: " . $e->getMessage());
}
?>
