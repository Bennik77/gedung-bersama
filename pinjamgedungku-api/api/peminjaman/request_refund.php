<?php
require_once '../../config/koneksi.php';
require_once '../../config/email.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Hanya POST yang diizinkan");
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_peminjaman']) || !isset($data['id_peminjam'])) {
    response(false, "ID peminjaman dan peminjam wajib diisi");
}

$id_peminjaman = $data['id_peminjaman'];
$id_peminjam = $data['id_peminjam'];
$reason = $data['reason'] ?? '';

try {
    // Cek peminjaman exists dan belongs to user
    $stmt = $conn->prepare("
        SELECT p.*, g.harga_sewa, pm.email 
        FROM peminjaman p
        JOIN gedung g ON p.id_gedung = g.id_gedung
        JOIN peminjam pm ON p.id_peminjam = pm.id_peminjam
        WHERE p.id_peminjaman = ? AND p.id_peminjam = ?
    ");
    $stmt->execute([$id_peminjaman, $id_peminjam]);
    $peminjaman = $stmt->fetch();

    if (!$peminjaman) {
        response(false, "Peminjaman tidak ditemukan");
    }

    // Cek apakah sudah pernah request refund
    // Cek apakah sudah pernah request refund atau sudah direfund
    if ($peminjaman['refund_status'] !== null && $peminjaman['refund_status'] !== 'rejected') {
        response(false, "Peminjaman ini sudah pernah mengajukan refund");
    }

    // Double check payments table
    $stmt = $conn->prepare("SELECT status_pembayaran FROM pembayaran WHERE id_peminjaman = ?");
    $stmt->execute([$id_peminjaman]);
    $paymentStatus = $stmt->fetchColumn();

    if ($paymentStatus === 'refunded' || $paymentStatus === 'refund_requested') {
         response(false, "Dana untuk peminjaman ini sedang diproses atau sudah dikembalikan");
    }

    // Calculate refund amount (90% dari harga)
    $refund_amount = $peminjaman['harga_sewa'] * 0.9;

    // Update peminjaman dengan status refund_requested
    $stmt = $conn->prepare("
        UPDATE peminjaman 
        SET refund_status = 'pending', 
            refund_amount = ?,
            refund_requested_at = NOW(),
            refund_notes = ?
        WHERE id_peminjaman = ?
    ");
    $stmt->execute([$refund_amount, $reason, $id_peminjaman]);

    sendRefundRequestedEmail($peminjaman['email'], $peminjaman['nama_peminjam'], [
        'id_peminjaman' => $id_peminjaman,
        'amount' => $refund_amount
    ]);

    response(true, "Permintaan refund berhasil diajukan. Admin akan meninjaunya dalam 1-2 hari kerja.", [
        'id_peminjaman' => $id_peminjaman,
        'refund_amount' => $refund_amount,
        'refund_status' => 'pending'
    ]);

} catch (Exception $e) {
    response(false, "Terjadi kesalahan: " . $e->getMessage());
}
?>
