<?php
require_once '../../config/koneksi.php';

// Hash untuk 'admin123'
$newPassword = password_hash('admin123', PASSWORD_DEFAULT);

try {
    // Update semua admin jadi password 'admin123'
    $stmt = $conn->prepare("UPDATE petugas SET password = ?");
    $stmt->execute([$newPassword]);
    
    echo "<h1>Reset Berhasil</h1>";
    echo "<p>Semua akun petugas/admin sekarang memiliki password: <strong>admin123</strong></p>";
    echo "<p>Silakan coba login kembali.</p>";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
