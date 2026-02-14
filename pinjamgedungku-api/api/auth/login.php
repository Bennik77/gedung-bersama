<?php
require_once '../../config/koneksi.php';

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    response(false, "Email dan password wajib diisi");
}

$stmt = $conn->prepare("SELECT * FROM peminjam WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    response(false, "Email atau password salah");
}

if ($user['is_verified'] == 0) {
    response(false, "Akun belum diverifikasi. Silakan cek email Anda.");
}

unset($user['password']);
session_start();
$_SESSION['user'] = $user;
$_SESSION['role'] = 'peminjam';

response(true, "Login berhasil", [
    "id" => $user['id_peminjam'],
    "nama" => $user['nama_peminjam'],
    "email" => $user['email'],
    "role" => "peminjam",
    "no_telepon" => $user['no_telepon'],
    "alamat" => $user['alamat']
]);
?>
