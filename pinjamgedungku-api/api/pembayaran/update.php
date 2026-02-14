<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_pembayaran'] ?? 0;
$jumlah = $input['jumlah'] ?? 0;
$status = $input['status_pembayaran'] ?? '';
$metode = $input['metode_pembayaran'] ?? '';

if (empty($id)) response(false, "Data tidak lengkap");

try {
    $stmt = $conn->prepare("UPDATE pembayaran SET jumlah = ?, status_pembayaran = ?, metode_pembayaran = ? WHERE id_pembayaran = ?");
    $stmt->execute([$jumlah, $status, $metode, $id]);
    response(true, "Pembayaran diperbarui");
} catch (PDOException $e) {
    response(false, "Gagal update: " . $e->getMessage());
}
?>
