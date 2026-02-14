<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$nama_gedung = trim($input['nama_gedung'] ?? '');
$lokasi = trim($input['lokasi'] ?? '');
$kapasitas = $input['kapasitas'] ?? 0;
$harga_sewa = $input['harga_sewa'] ?? 0;
$deskripsi = trim($input['deskripsi'] ?? '');
$gambar = $input['gambar'] ?? '';

$koordinator_id = !empty($input['koordinator_id']) ? $input['koordinator_id'] : null;

if (empty($nama_gedung) || empty($lokasi) || empty($kapasitas)) {
    response(false, "Nama, lokasi, dan kapasitas wajib diisi");
}

try {
    $stmt = $conn->prepare("INSERT INTO gedung (nama_gedung, lokasi, kapasitas, harga_sewa, deskripsi, gambar, koordinator_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nama_gedung, $lokasi, $kapasitas, $harga_sewa, $deskripsi, $gambar, $koordinator_id]);

    response(true, "Gedung berhasil ditambahkan", ["id" => $conn->lastInsertId()]);
}
catch (PDOException $e) {
    response(false, "Gagal menambahkan gedung: " . $e->getMessage());
}
?>
