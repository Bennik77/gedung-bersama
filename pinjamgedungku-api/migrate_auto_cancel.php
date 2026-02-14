<?php
require_once 'config/koneksi.php';

try {
    $conn->exec("ALTER TABLE peminjaman ADD COLUMN batas_waktu_bayar DATETIME DEFAULT NULL");
    echo "Berhasil menambahkan kolom batas_waktu_bayar";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Kolom sudah ada";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
?>
