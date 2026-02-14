<?php
require_once '../../config/koneksi.php';

$search = $_GET['search'] ?? '';
$status = $_GET['status'] ?? '';
$kapasitas_min = $_GET['kapasitas_min'] ?? 0;
$kapasitas_max = $_GET['kapasitas_max'] ?? 0;

$sql = "SELECT g.*, p.nama_petugas as nama_koordinator 
        FROM gedung g
        LEFT JOIN petugas p ON g.koordinator_id = p.id_petugas 
        WHERE 1=1";
$params = [];

if (!empty($search)) {
    $sql .= " AND (nama_gedung LIKE ? OR lokasi LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if (!empty($status) && $status !== 'semua') {
    $sql .= " AND status = ?";
    $params[] = $status;
}

if ($kapasitas_min > 0) {
    $sql .= " AND kapasitas >= ?";
    $params[] = $kapasitas_min;
}

if ($kapasitas_max > 0) {
    $sql .= " AND kapasitas <= ?";
    $params[] = $kapasitas_max;
}

$sql .= " ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->execute($params);
$gedung = $stmt->fetchAll();

response(true, "Data gedung berhasil diambil", $gedung);
?>
