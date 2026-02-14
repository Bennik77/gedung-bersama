<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$stmt = $conn->prepare("SELECT id_petugas, nama_petugas, email, jabatan, no_telepon, foto FROM petugas ORDER BY nama_petugas ASC");
$stmt->execute();
$petugas = $stmt->fetchAll();

response(true, "Data petugas berhasil diambil", $petugas);
?>
