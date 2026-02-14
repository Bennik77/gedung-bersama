<?php
require_once '../../config/koneksi.php';

require_once '../../config/email.php';

$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true);

$nama = trim($input['nama_peminjam'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$no_telepon = trim($input['no_telepon'] ?? '');
$alamat = trim($input['alamat'] ?? '');

if (empty($nama) || empty($email) || empty($password) || empty($no_telepon)) {
    response(false, "Semua field wajib diisi");
}


$stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    response(false, "Email sudah terdaftar");
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$otp_code = sprintf("%06d", mt_rand(100000, 999999));

try {
    $stmt = $conn->prepare("INSERT INTO peminjam (nama_peminjam, email, password, no_telepon, alamat, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)");
    $stmt->execute([$nama, $email, $hashed_password, $no_telepon, $alamat, $otp_code]);
    
    sendVerificationEmail($email, $otp_code);
    
    response(true, "Registrasi berhasil. Silakan cek email Anda untuk kode verifikasi.");
} catch (PDOException $e) {
    response(false, "Registrasi gagal: " . $e->getMessage());
}
?>
