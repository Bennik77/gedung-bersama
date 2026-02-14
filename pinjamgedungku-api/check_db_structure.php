<?php
require_once 'config/koneksi.php';

try {
    echo "--- PEMBAYARAN ---\n";
    $stmt = $conn->query("SHOW CREATE TABLE pembayaran");
    print_r($stmt->fetch());

    echo "\n--- PEMINJAMAN ---\n";
    $stmt = $conn->query("SHOW CREATE TABLE peminjaman");
    print_r($stmt->fetch());
}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
