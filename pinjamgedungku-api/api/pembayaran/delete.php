<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_pembayaran'] ?? 0;

if (empty($id)) response(false, "ID wajib diisi");

try {
    $stmt = $conn->prepare("DELETE FROM pembayaran WHERE id_pembayaran = ?");
    $stmt->execute([$id]);
    response(true, "Pembayaran berhasil dihapus");
} catch (PDOException $e) {
    response(false, "Gagal menghapus: " . $e->getMessage());
}
?>
