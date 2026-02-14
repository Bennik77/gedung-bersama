<?php
require_once '../../config/koneksi.php';
require_once '../../config/email.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    response(false, "Hanya PUT yang diizinkan");
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_peminjaman']) || !isset($data['action'])) {
    response(false, "ID peminjaman dan action wajib diisi");
}

$id_peminjaman = $data['id_peminjaman'];
$action = $data['action']; // 'approve' atau 'reject'
$admin_notes = $data['admin_notes'] ?? '';

if (!in_array($action, ['approve', 'reject'])) {
    response(false, "Action harus 'approve' atau 'reject'");
}

try {
    // Cek peminjaman dengan status refund pending
    $stmt = $conn->prepare("
        SELECT p.*, pm.nama_peminjam, pm.email 
        FROM peminjaman p
        JOIN peminjam pm ON p.id_peminjam = pm.id_peminjam
        WHERE p.id_peminjaman = ? AND p.refund_status = 'pending'
    ");
    $stmt->execute([$id_peminjaman]);
    $peminjaman = $stmt->fetch();

    if (!$peminjaman) {
        response(false, "Peminjaman dengan status refund pending tidak ditemukan");
    }

    if ($action === 'approve') {
        // Update status peminjaman menjadi dibatalkan
        $stmt = $conn->prepare("
            UPDATE peminjaman 
            SET refund_status = 'approved',
                status_peminjaman = 'dibatalkan',
                refund_approved_at = NOW(),
                refund_notes = ?
            WHERE id_peminjaman = ?
        ");
        $stmt->execute([$admin_notes, $id_peminjaman]);

        // ALso update pembayaran status to 'refunded'
        $stmt = $conn->prepare("UPDATE pembayaran SET status_pembayaran = 'refunded' WHERE id_peminjaman = ?");
        $stmt->execute([$id_peminjaman]);

        // Send email to user
        sendRefundStatusEmail($peminjaman['email'], $peminjaman['nama_peminjam'], [
            'status' => $action,
            'kode_booking' => $peminjaman['kode_booking'],
            'amount' => $peminjaman['refund_amount'],
            'reason' => $admin_notes
        ]);
        
        $status_msg = "Refund disetujui dan status peminjaman diubah menjadi dibatalkan";
    } else {
        // Reject refund
        $stmt = $conn->prepare("
            UPDATE peminjaman 
            SET refund_status = 'rejected',
                refund_notes = ?
            WHERE id_peminjaman = ?
        ");
        $stmt->execute([$admin_notes, $id_peminjaman]);

        // Send email to user
        sendRefundStatusEmail($peminjaman['email'], $peminjaman['nama_peminjam'], [
            'status' => $action,
            'kode_booking' => $peminjaman['kode_booking'],
            'amount' => $peminjaman['refund_amount'],
            'reason' => $admin_notes
        ]);
        
        $status_msg = "Refund ditolak";
    }

    response(true, $status_msg, [
        'id_peminjaman' => $id_peminjaman,
        'refund_status' => $action === 'approve' ? 'approved' : 'rejected',
        'peminjaman_status' => $action === 'approve' ? 'dibatalkan' : $peminjaman['status_peminjaman']
    ]);

} catch (Exception $e) {
    response(false, "Terjadi kesalahan: " . $e->getMessage());
}
?>
