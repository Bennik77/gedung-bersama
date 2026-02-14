<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$stmt = $conn->prepare("SELECT id_peminjam, nama_peminjam, email, no_telepon, alamat FROM peminjam ORDER BY nama_peminjam ASC");
$stmt->execute();
$peminjam = $stmt->fetchAll();

response(true, "Data peminjam berhasil diambil", $peminjam);
?>
