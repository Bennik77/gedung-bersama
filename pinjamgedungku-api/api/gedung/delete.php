<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$id = $_GET['id'] ?? 0;

if (empty($id)) {
    response(false, "ID Gedung wajib diisi");
}

try {
    $stmt = $conn->prepare("DELETE FROM gedung WHERE id_gedung = ?");
    $stmt->execute([$id]);
    
    response(true, "Gedung berhasil dihapus");
} catch (PDOException $e) {
    response(false, "Gagal menghapus gedung: " . $e->getMessage());
}
?>
