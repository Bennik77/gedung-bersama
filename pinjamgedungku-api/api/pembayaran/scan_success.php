<?php
require_once '../../config/koneksi.php';
require_once '../../config/email.php';

$input = json_decode(file_get_contents("php://input"), true);
$id_pembayaran = $input['id_pembayaran'] ?? 0;

if (empty($id_pembayaran)) {
    response(false, "ID Pembayaran wajib diisi");
}

try {
    // Simulasi callback sukses dari payment gateway
    $stmt = $conn->prepare("UPDATE pembayaran SET status_pembayaran = 'berhasil', tanggal_pembayaran = NOW() WHERE id_pembayaran = ?");
    $stmt->execute([$id_pembayaran]);
    
    // Get info for email
    $stmt = $conn->prepare("
        SELECT p.kode_booking, p.jumlah, p.tanggal_pembayaran, pm.nama_peminjam, pm.email
        FROM pembayaran p
        JOIN peminjaman pem ON p.id_peminjaman = pem.id_peminjaman
        JOIN peminjam pm ON pem.id_peminjam = pm.id_peminjam
        WHERE p.id_pembayaran = ?
    ");
    $stmt->execute([$id_pembayaran]);
    $data = $stmt->fetch();
    
    if ($data) {
        $msg = "Halo " . $data['nama_peminjam'] . ",\n\n" .
               "Pembayaran Anda berhasil!\n" .
               "Kode Booking: " . $data['kode_booking'] . "\n" .
               "Jumlah: Rp " . number_format($data['jumlah'], 0, ',', '.') . "\n" .
               "Tanggal: " . $data['tanggal_pembayaran'] . "\n\n" .
               "Simpan struk ini sebagai bukti pembayaran yang sah.";
        
        // Use the same mock email function
        // Note: Using a slightly modified version of sendVerificationEmail or creating a new helper would be cleaner,
        // but for now we'll just log it manually or reuse the concept.
        
        $logContent = "TO: " . $data['email'] . "\nSUBJECT: Struk Pembayaran - " . $data['kode_booking'] . "\nMESSAGE:\n" . $msg . "\n\n";
        file_put_contents("../../email_log.txt", $logContent, FILE_APPEND);
    }
    
    response(true, "Pembayaran berhasil disimulasikan");
} catch (PDOException $e) {
    response(false, "Gagal simulasi: " . $e->getMessage());
}
?>
