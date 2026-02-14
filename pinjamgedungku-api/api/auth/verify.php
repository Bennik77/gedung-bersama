<?php
require_once '../../config/koneksi.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die("Token tidak valid");
}

$stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE verification_token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    die("Token tidak valid atau sudah kadaluarsa");
}

try {
    $stmt = $conn->prepare("UPDATE peminjam SET is_verified = 1, verification_token = NULL WHERE id_peminjam = ?");
    $stmt->execute([$user['id_peminjam']]);
    
    echo "<h1>Verifikasi Berhasil!</h1><p>Akun Anda telah aktif. Silakan login di aplikasi.</p>";
} catch (PDOException $e) {
    die("Gagal verifikasi: " . $e->getMessage());
}
?>
