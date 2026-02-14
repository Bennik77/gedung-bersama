<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    response(false, "Unauthorized");
}

$role = $_SESSION['role'];
$user_id = $_SESSION['user']['id_peminjam'] ?? $_SESSION['user']['id_petugas'];

$sql = "SELECT p.*, pm.id_peminjam 
        FROM pembayaran p
        JOIN peminjaman pm ON p.id_peminjaman = pm.id_peminjaman
        WHERE 1=1";

if ($role === 'peminjam') {
    $sql .= " AND pm.id_peminjam = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id]);
} else {
    $sql .= " ORDER BY p.created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
}

$pembayaran = $stmt->fetchAll();
response(true, "Data pembayaran berhasil diambil", $pembayaran);
?>
