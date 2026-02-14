<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$nama = trim($input['nama_petugas'] ?? $input['nama'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? 'petugas123';
$jabatan = trim($input['jabatan'] ?? '');
$no_telepon = trim($input['no_telepon'] ?? '');

if (empty($nama) || empty($email) || empty($jabatan)) {
    response(false, "Nama, email, dan jabatan wajib diisi");
}


$stmt = $conn->prepare("SELECT id_petugas FROM petugas WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    response(false, "Email sudah terdaftar");
}

$foto = trim($input['foto'] ?? '');

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO petugas (nama_petugas, email, password, jabatan, no_telepon, foto) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nama, $email, $hashed_password, $jabatan, $no_telepon, $foto]);
    
    response(true, "Petugas berhasil ditambahkan", ["id" => $conn->lastInsertId()]);
} catch (PDOException $e) {

    response(false, "Gagal menambahkan petugas: " . $e->getMessage());
}
?>
