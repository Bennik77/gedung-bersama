<?php
require_once '../../config/koneksi.php';
require_once '../../config/email.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_pembayaran'] ?? 0;
$action = $input['action'] ?? 'approve'; // 'approve' or 'reject'

try {
    if ($action === 'approve') {
        // Status Refunded
        $stmt = $conn->prepare("UPDATE pembayaran SET status_pembayaran = 'refunded' WHERE id_pembayaran = ?");
        $stmt->execute([$id]);

        // Cancel booking as well? Yes.
        $stmt = $conn->prepare("UPDATE peminjaman SET status_peminjaman = 'dibatalkan' WHERE id_peminjaman = (SELECT id_peminjaman FROM pembayaran WHERE id_pembayaran = ?)");
        $stmt->execute([$id]);

        // Send Email
        // Join to get data
        $stmt = $conn->prepare("
            SELECT p.id_pembayaran, p.jumlah, m.email, m.nama_peminjam, pm.kode_booking
            FROM pembayaran p
            JOIN peminjaman pm ON p.id_peminjaman = pm.id_peminjaman
            JOIN peminjam m ON pm.id_peminjam = m.id_peminjam
            WHERE p.id_pembayaran = ?
        ");
        $stmt->execute([$id]);
        $data = $stmt->fetch();

        if ($data) {
             sendRefundStatusEmail($data['email'], $data['nama_peminjam'], [
                 'status' => 'refunded',
                 'kode_booking' => $data['kode_booking'],
                 'amount' => $data['jumlah']
             ]);
        }
        
        response(true, "Refund disetujui dan email dikirim");

    } else {
        // Reject Refund - kembalikan ke 'berhasil'?
        $stmt = $conn->prepare("UPDATE pembayaran SET status_pembayaran = 'berhasil' WHERE id_pembayaran = ?");
        $stmt->execute([$id]);
        response(true, "Refund ditolak, tetap status Berhasil");
    }

} catch (PDOException $e) {
    response(false, "Gagal memproses refund: " . $e->getMessage());
}
?>
