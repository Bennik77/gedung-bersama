<?php
require_once '../config/koneksi.php';
header('Content-Type: application/json');

try {
    $stmt = $conn->query("SHOW COLUMNS FROM petugas");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "columns" => $columns]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
