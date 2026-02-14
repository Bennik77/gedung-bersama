<?php
require_once '../../config/koneksi.php';

$id = $_GET['id_gedung'] ?? $_GET['id'] ?? 0;

if (empty($id)) {
    response(false, "ID Gedung wajib diisi");
}

$stmt = $conn->prepare("SELECT * FROM gedung WHERE id_gedung = ?");
$stmt->execute([$id]);
$gedung = $stmt->fetch();

if (!$gedung) {
    response(false, "Gedung tidak ditemukan");
}

response(true, "Data gedung berhasil diambil", $gedung);
?>
