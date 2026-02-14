<?php
require_once '../../config/koneksi.php';

$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    response(false, "Email dan password wajib diisi");
}

$stmt = $conn->prepare("SELECT * FROM petugas WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    $verify = password_verify($password, $user['password']);
} 

if (!$user || !password_verify($password, $user['password'])) {
    response(false, "Email atau password salah");
}

unset($user['password']);
session_start();
$_SESSION['user'] = $user;
$_SESSION['role'] = 'admin';

response(true, "Login berhasil", [
    "id" => $user['id_petugas'],
    "nama" => $user['nama_petugas'],
    "email" => $user['email'],
    "role" => "admin",
    "jabatan" => $user['jabatan'],
    "no_telepon" => $user['no_telepon']
]);
?>
