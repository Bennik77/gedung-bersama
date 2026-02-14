<?php
require_once '../../config/koneksi.php';

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? '');
$otp = trim($input['otp'] ?? '');

if (empty($email) || empty($otp)) {
    response(false, "Email dan Kode OTP wajib diisi");
}


$stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE email = ? AND verification_token = ?");
$stmt->execute([$email, $otp]);
$user = $stmt->fetch();

if (!$user) {
    response(false, "Kode verifikasi salah atau email tidak cocok");
}

try {

    $update = $conn->prepare("UPDATE peminjam SET is_verified = 1, verification_token = NULL WHERE id_peminjam = ?");
    $update->execute([$user['id_peminjam']]);
    
    response(true, "Verifikasi berhasil. Silakan login.");
} catch (PDOException $e) {
    response(false, "Gagal verifikasi: " . $e->getMessage());
}
?>
