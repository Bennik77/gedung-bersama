<?php
// API untuk menghapus ulasan
require_once dirname(__DIR__, 2) . '/config/koneksi.php';

// Validasi method
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit();
}

try {
    $id_ulasan = $_GET['id_ulasan'] ?? null;

    if (!$id_ulasan) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID ulasan diperlukan']);
        exit();
    }

    // Cek ulasan ada atau tidak
    $checkQuery = "SELECT id_ulasan FROM ulasan WHERE id_ulasan = :id_ulasan";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([':id_ulasan' => $id_ulasan]);
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Ulasan tidak ditemukan']);
        exit();
    }

    // Hapus ulasan
    $deleteQuery = "DELETE FROM ulasan WHERE id_ulasan = :id_ulasan";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->execute([':id_ulasan' => $id_ulasan]);

    echo json_encode([
        'success' => true,
        'message' => 'Ulasan berhasil dihapus'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
