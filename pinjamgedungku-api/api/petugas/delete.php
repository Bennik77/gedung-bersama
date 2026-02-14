<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$id = $_GET['id'] ?? 0;

if (empty($id)) {
    response(false, "ID Petugas wajib diisi");
}

if ($id <= 2) {
    response(false, "Akun Administrator Utama tidak dapat dihapus");
}

try {
    $stmt = $conn->prepare("DELETE FROM petugas WHERE id_petugas = ?");
    $stmt->execute([$id]);
    
    response(true, "Petugas berhasil dihapus");
} catch (PDOException $e) {
    response(false, "Gagal menghapus petugas: " . $e->getMessage());
}
?>
