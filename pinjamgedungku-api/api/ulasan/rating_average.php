<?php
// API untuk mendapatkan rata-rata rating gedung
require_once dirname(__DIR__, 2) . '/config/koneksi.php';

// Validasi method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit();
}

try {
    $id_gedung = $_GET['id_gedung'] ?? null;

    if (!$id_gedung) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID gedung diperlukan']);
        exit();
    }

    // Query rata-rata rating
    $query = "SELECT 
                COALESCE(AVG(rating), 0) as average_rating,
                COUNT(*) as total_ulasan,
                COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5,
                COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
                COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
                COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
                COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1
              FROM ulasan
              WHERE id_gedung = :id_gedung";

    $stmt = $conn->prepare($query);
    $stmt->execute([':id_gedung' => $id_gedung]);
    $result = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'data' => $result
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
