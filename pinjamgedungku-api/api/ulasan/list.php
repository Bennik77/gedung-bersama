<?php
// API untuk mendapatkan daftar ulasan berdasarkan gedung atau peminjaman
require_once dirname(__DIR__, 2) . '/config/koneksi.php';

// Validasi method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit();
}

try {
    $id_gedung = $_GET['id_gedung'] ?? null;
    $id_peminjaman = $_GET['id_peminjaman'] ?? null;


    $query = "SELECT 
                u.id_ulasan,
                u.id_peminjaman,
                u.id_peminjam,
                u.id_gedung,
                u.rating,
                u.teks_ulasan,
                u.created_at,
                p.nama_peminjam,
                g.nama_gedung
              FROM ulasan u
              JOIN peminjam p ON u.id_peminjam = p.id_peminjam
              JOIN gedung g ON u.id_gedung = g.id_gedung
              WHERE 1=1";

    $params = [];

    if ($id_gedung) {
        $query .= " AND u.id_gedung = :id_gedung";
        $params[':id_gedung'] = $id_gedung;
    }

    if ($id_peminjaman) {
        $query .= " AND u.id_peminjaman = :id_peminjaman";
        $params[':id_peminjaman'] = $id_peminjaman;
    }

    $query .= " ORDER BY u.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $ulasans = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $ulasans,
        'count' => count($ulasans)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
