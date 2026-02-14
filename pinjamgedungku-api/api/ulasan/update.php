<?php
// API untuk memperbarui ulasan
require_once dirname(__DIR__, 2) . '/config/koneksi.php';

// Validasi method
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id_ulasan'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID ulasan diperlukan']);
        exit();
    }

    // Cek ulasan ada atau tidak
    $checkQuery = "SELECT id_ulasan FROM ulasan WHERE id_ulasan = :id_ulasan";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([':id_ulasan' => $data['id_ulasan']]);
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Ulasan tidak ditemukan']);
        exit();
    }

    // Update query
    $updateFields = [];
    $params = [':id_ulasan' => $data['id_ulasan']];

    if (isset($data['rating'])) {
        $rating = intval($data['rating']);
        if ($rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Rating harus antara 1-5']);
            exit();
        }
        $updateFields[] = "rating = :rating";
        $params[':rating'] = $rating;
    }

    if (isset($data['teks_ulasan'])) {
        $updateFields[] = "teks_ulasan = :teks_ulasan";
        $params[':teks_ulasan'] = trim($data['teks_ulasan']);
    }

    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tidak ada data untuk diupdate']);
        exit();
    }

    $updateFields[] = "updated_at = CURRENT_TIMESTAMP";
    $updateQuery = "UPDATE ulasan SET " . implode(", ", $updateFields) . " WHERE id_ulasan = :id_ulasan";
    
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->execute($params);

    // Ambil data ulasan yang sudah diupdate
    $getQuery = "SELECT * FROM ulasan WHERE id_ulasan = :id_ulasan";
    $getStmt = $conn->prepare($getQuery);
    $getStmt->execute([':id_ulasan' => $data['id_ulasan']]);
    $ulasan = $getStmt->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Ulasan berhasil diperbarui',
        'data' => $ulasan
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
