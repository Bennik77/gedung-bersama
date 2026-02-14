<?php
require_once '../../config/koneksi.php';
session_start();

$debugParams = print_r([
    'session_id' => session_id(),
    'session_user' => $_SESSION['user'] ?? 'NULL',
    'session_role' => $_SESSION['role'] ?? 'NULL',
    'input' => file_get_contents("php://input")
], true);
file_put_contents("debug_booking.txt", $debugParams, FILE_APPEND);

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'peminjam') {
    http_response_code(401);
    response(false, "Unauthorized - Please login first");
}

$input = json_decode(file_get_contents("php://input"), true);

$id_peminjam = $_SESSION['user']['id_peminjam'];
$id_gedung = $input['id_gedung'] ?? 0;
$tanggal_mulai = $input['tanggal_mulai'] ?? '';
$tanggal_selesai = $input['tanggal_selesai'] ?? '';
$tujuan_acara = trim($input['tujuan_acara'] ?? '');

// Validasi
if (empty($id_gedung) || empty($tanggal_mulai) || empty($tanggal_selesai) || empty($tujuan_acara)) {
    response(false, "Semua field wajib diisi");
}

// Cek konflik jadwal
$stmt = $conn->prepare("
    SELECT COUNT(*) FROM peminjaman 
    WHERE id_gedung = ? 
    AND status_peminjaman = 'disetujui'
    AND ((tanggal_mulai BETWEEN ? AND ?) OR (tanggal_selesai BETWEEN ? AND ?))
");
$stmt->execute([$id_gedung, $tanggal_mulai, $tanggal_selesai, $tanggal_mulai, $tanggal_selesai]);

if ($stmt->fetchColumn() > 0) {
    response(false, "Jadwal bentrok dengan peminjaman lain");
}

// Insert peminjaman
try {
    $stmt = $conn->prepare("
            INSERT INTO peminjaman (id_peminjam, id_gedung, tanggal_mulai, tanggal_selesai, tujuan_acara, status_peminjaman) 
            VALUES (?, ?, ?, ?, ?, 'menunggu')
        ");
    $stmt->execute([$id_peminjam, $id_gedung, $tanggal_mulai, $tanggal_selesai, $tujuan_acara]);

    response(true, "Pengajuan peminjaman berhasil", ["id" => $conn->lastInsertId()]);
}
catch (PDOException $e) {
    response(false, "Gagal mengajuan peminjaman: " . $e->getMessage());
}
?>
