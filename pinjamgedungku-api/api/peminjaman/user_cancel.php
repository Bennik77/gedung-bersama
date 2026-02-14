<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_peminjaman'] ?? 0;
// Note: user doesn't update 'status' manually usually, logic handles it.

try {
    // Cek status saat ini
    $stmt = $conn->prepare("SELECT p.*, py.status_pembayaran FROM peminjaman p LEFT JOIN pembayaran py ON p.id_peminjaman = py.id_peminjaman WHERE p.id_peminjaman = ?");
    $stmt->execute([$id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        response(false, "Booking tidak ditemukan");
    }

    // Hanya pemilik yang boleh cancel
    if ($booking['id_peminjam'] != $_SESSION['user']['id_peminjam']) {
        response(false, "Akses ditolak");
    }

    if ($booking['status_peminjaman'] === 'menunggu') {
        // Jika masih menunggu, langsung batalkan (hapus atau set status canceled)
        // Kita set status 'dibatalkan'
        $stmt = $conn->prepare("UPDATE peminjaman SET status_peminjaman = 'dibatalkan' WHERE id_peminjaman = ?");
        $stmt->execute([$id]);
        response(true, "Peminjaman dibatalkan");
    } elseif ($booking['status_peminjaman'] === 'disetujui' && $booking['status_pembayaran'] === 'berhasil') {
        // Jika sudah bayar -> Pengajuan Refund
        // Kita update status peminjaman jadi 'pengajuan_refund' ? Atau ada status khusus?
        // Let's use status_peminjaman = 'pengajuan_refund' logic.
        // Or keep status_peminjaman 'disetujui' but update payment status? 
        // User asked for "Pengajuan Refund". Let's update `pembayaran` status to 'pengajuan_refund' is cleaner maybe? Use specific flag.
        // Or update peminjaman status to 'batal_refund'. 
        // Let's stick to plan: 'pengajuan_refund' status on PEMINJAMAN or PEMBAYARAN?
        // Since refund is about money, let's update PEMBAYARAN status to 'refund_requested' and PEMINJAMAN to 'dibatalkan' (future) or 'pending_refund'.
        // Let's use `status_pembayaran = 'refund_requested'`.
        
        $stmt = $conn->prepare("UPDATE pembayaran SET status_pembayaran = 'refund_requested' WHERE id_peminjaman = ?");
        $stmt->execute([$id]);
        
        // Also optional: update peminjaman status so it doesn't show as active schedule?
        // Let's keep peminjaman as 'disetujui' until refund processed, or 'refund_req'.
        // Let's set peminjaman status to 'batal_pending' so it's clear?
        // Let's just update Payment status for now as the trigger.
        
        response(true, "Permintaan refund dikirim. Menunggu persetujuan admin.");
    } else {
         $stmt = $conn->prepare("UPDATE peminjaman SET status_peminjaman = 'dibatalkan' WHERE id_peminjaman = ?");
         $stmt->execute([$id]);
         response(true, "Peminjaman dibatalkan");
    }

} catch (PDOException $e) {
    response(false, "Gagal memproses: " . $e->getMessage());
}
?>
