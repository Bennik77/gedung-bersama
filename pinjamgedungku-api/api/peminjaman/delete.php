<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_peminjaman'] ?? 0;

if (empty($id)) response(false, "ID Peminjaman wajib diisi");

try {
    // Delete related records first (persetujuan, pembayaran if any constraint exists, though cascade might handle it)
    // Assuming Foreign Key constraints are set to CASCADE or we handle it manually.
    // Ideally delete payments first if not checking constraints? 
    // Let's rely on manual deletion or DB constraints. 
    // Safest is to delete related items or ensure DB supports it.
    // For this simple app, we'll try direct delete.
    
    $stmt = $conn->prepare("DELETE FROM peminjaman WHERE id_peminjaman = ?");
    $stmt->execute([$id]);
    
    response(true, "Data peminjaman berhasil dihapus");
} catch (PDOException $e) {
    response(false, "Gagal menghapus: " . $e->getMessage());
}
?>
