<?php
require_once '../../config/koneksi.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Hanya POST yang diizinkan");
}

$data = json_decode(file_get_contents("php://input"), true);

// Validasi
$nama_peminjam = trim($data['nama_peminjam'] ?? '');
$email = trim($data['email'] ?? '');
$no_telepon = trim($data['no_telepon'] ?? '');
$alamat = trim($data['alamat'] ?? '');
$password = trim($data['password'] ?? '');

if (!$nama_peminjam || !$email || !$no_telepon || !$alamat || !$password) {
    response(false, "Semua field wajib diisi");
}

// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response(false, "Email tidak valid");
}

// Cek email sudah terdaftar
$stmt = $conn->prepare("SELECT COUNT(*) FROM peminjam WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetchColumn() > 0) {
    response(false, "Email sudah terdaftar");
}

try {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("
        INSERT INTO peminjam (nama_peminjam, email, no_telepon, alamat, password, is_verified)
        VALUES (?, ?, ?, ?, ?, 1)
    ");
    
    $stmt->execute([$nama_peminjam, $email, $no_telepon, $alamat, $hashed_password]);
    
    $id = $conn->lastInsertId();
    
    response(true, "Peminjam berhasil ditambahkan", [
        'id_peminjam' => $id,
        'nama_peminjam' => $nama_peminjam,
        'email' => $email,
        'no_telepon' => $no_telepon,
        'alamat' => $alamat
    ]);
    
} catch (Exception $e) {
    response(false, "Terjadi kesalahan: " . $e->getMessage());
}
?>
