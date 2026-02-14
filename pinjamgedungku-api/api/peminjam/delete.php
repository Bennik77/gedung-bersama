<?php
require_once '../../config/koneksi.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Hanya DELETE/POST yang diizinkan");
}

$data = json_decode(file_get_contents("php://input"), true);

$id_peminjam = $data['id_peminjam'] ?? 0;

if (!$id_peminjam) {
    response(false, "ID Peminjam wajib diisi");
}

try {
    // Cek peminjam exists
    $stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE id_peminjam = ?");
    $stmt->execute([$id_peminjam]);
    if (!$stmt->fetch()) {
        response(false, "Peminjam tidak ditemukan");
    }

    // Delete peminjam (cascade delete akan handle related data)
    $stmt = $conn->prepare("DELETE FROM peminjam WHERE id_peminjam = ?");
    $stmt->execute([$id_peminjam]);

    response(true, "Peminjam berhasil dihapus", [
        'id_peminjam' => $id_peminjam
    ]);

} catch (Exception $e) {
    response(false, "Terjadi kesalahan: " . $e->getMessage());
}
?>
