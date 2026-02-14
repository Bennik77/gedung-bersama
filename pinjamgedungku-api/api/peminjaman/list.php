<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    response(false, "Unauthorized");
}

$role = $_SESSION['role'];
$user_id = $_SESSION['user']['id_peminjam'] ?? $_SESSION['user']['id_petugas'];

$sql = "SELECT p.*, g.nama_gedung, pm.nama_peminjam, pr.keterangan as catatan_admin 
        FROM peminjaman p
        JOIN gedung g ON p.id_gedung = g.id_gedung
        JOIN peminjam pm ON p.id_peminjam = pm.id_peminjam
        LEFT JOIN persetujuan pr ON p.id_peminjaman = pr.id_peminjaman
        WHERE 1=1";

if ($role === 'peminjam') {
    $sql .= " AND p.id_peminjam = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id]);
} else {
    // Admin sees all
    $sql .= " ORDER BY p.created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
}

$peminjaman = $stmt->fetchAll();
response(true, "Data peminjaman berhasil diambil", $peminjaman);
?>
