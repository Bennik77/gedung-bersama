<?php
// API untuk membuat ulasan baru
require_once dirname(__DIR__, 2) . '/config/koneksi.php';

// Validasi method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validasi input
    if (empty($data['id_peminjaman']) || empty($data['id_peminjam']) || 
        empty($data['id_gedung']) || empty($data['rating']) || empty($data['teks_ulasan'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
        exit();
    }

    // Validasi rating
    $rating = intval($data['rating']);
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Rating harus antara 1-5']);
        exit();
    }


    $checkQuery = "SELECT id_ulasan FROM ulasan WHERE id_peminjaman = :id_peminjaman";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([':id_peminjaman' => $data['id_peminjaman']]);
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ulasan untuk peminjaman ini sudah ada']);
        exit();
    }


    $statusQuery = "SELECT status_peminjaman FROM peminjaman WHERE id_peminjaman = :id_peminjaman";
    $statusStmt = $conn->prepare($statusQuery);
    $statusStmt->execute([':id_peminjaman' => $data['id_peminjaman']]);
    $peminjamanData = $statusStmt->fetch();

    if (!$peminjamanData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Peminjaman tidak ditemukan']);
        exit();
    }


    if ($peminjamanData['status_peminjaman'] !== 'disetujui') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Hanya peminjaman yang telah selesai yang bisa diulas']);
        exit();
    }


    $insertQuery = "INSERT INTO ulasan (id_peminjaman, id_peminjam, id_gedung, rating, teks_ulasan)
                    VALUES (:id_peminjaman, :id_peminjam, :id_gedung, :rating, :teks_ulasan)";
    
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->execute([
        ':id_peminjaman' => $data['id_peminjaman'],
        ':id_peminjam' => $data['id_peminjam'],
        ':id_gedung' => $data['id_gedung'],
        ':rating' => $rating,
        ':teks_ulasan' => trim($data['teks_ulasan'])
    ]);


    $id_ulasan = $conn->lastInsertId();
    $getQuery = "SELECT * FROM ulasan WHERE id_ulasan = :id_ulasan";
    $getStmt = $conn->prepare($getQuery);
    $getStmt->execute([':id_ulasan' => $id_ulasan]);
    $ulasan = $getStmt->fetch();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Ulasan berhasil dibuat',
        'data' => $ulasan
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
