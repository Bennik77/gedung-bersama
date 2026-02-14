<?php
require_once '../../config/koneksi.php';

// Hash untuk 'user123'
$newPassword = password_hash('user123', PASSWORD_DEFAULT);

try {
    // Update semua peminjam jadi password 'user123'
    // Kita juga set is_verified = 1 agar dummy user bisa langsung login (kecuali Andi yang sengaja kita buat 0 buat tes)
    $stmt = $conn->prepare("UPDATE peminjam SET password = ?, is_verified = 1 WHERE email != 'andi@email.com'");
    $stmt->execute([$newPassword]);
    
    // Andi tetap unverified untuk testing flow verifikasi
    $stmtAndi = $conn->prepare("UPDATE peminjam SET password = ? WHERE email = 'andi@email.com'");
    $stmtAndi->execute([$newPassword]);
    
    echo "<h1>Reset User Berhasil</h1>";
    echo "<p>Semua akun peminjam (Budi, Siti, dll) sekarang memiliki password: <strong>user123</strong></p>";
    echo "<p>Status akun juga di-set ke <strong>Terverifikasi</strong> (Kecuali Andi Pratama untuk tes verifikasi).</p>";
    echo "<p>Silakan coba login kembali di halaman utama.</p>";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
