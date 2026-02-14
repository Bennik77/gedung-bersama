<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id_gedung = $input['id_gedung'] ?? 0;
$nama_gedung = trim($input['nama_gedung'] ?? '');
$lokasi = trim($input['lokasi'] ?? '');
$kapasitas = $input['kapasitas'] ?? 0;
$harga_sewa = $input['harga_sewa'] ?? 0;
$status = $input['status'] ?? 'tersedia';
$deskripsi = trim($input['deskripsi'] ?? '');
$gambar = $input['gambar'] ?? '';
$koordinator_id = !empty($input['koordinator_id']) ? $input['koordinator_id'] : null;

if (empty($id_gedung) || empty($nama_gedung) || empty($lokasi) || empty($kapasitas)) {
    response(false, "ID, nama, lokasi, dan kapasitas wajib diisi");
}

try {
    $sql = "UPDATE gedung SET nama_gedung = ?, lokasi = ?, kapasitas = ?, harga_sewa = ?, status = ?, deskripsi = ?, koordinator_id = ?";
    $params = [$nama_gedung, $lokasi, $kapasitas, $harga_sewa, $status, $deskripsi, $koordinator_id];

    if (!empty($gambar)) {
        $sql .= ", gambar = ?";
        $params[] = $gambar;
    }

    $sql .= " WHERE id_gedung = ?";
    $params[] = $id_gedung;

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    response(true, "Gedung berhasil diupdate");
}
catch (PDOException $e) {
    response(false, "Gagal update gedung: " . $e->getMessage());
}
?>
