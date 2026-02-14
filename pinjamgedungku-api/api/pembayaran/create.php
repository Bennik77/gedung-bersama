<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'peminjam') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id_peminjaman = $input['id_peminjaman'] ?? 0;
$metode = $input['metode_pembayaran'] ?? '';
$jumlah = $input['jumlah'] ?? 0;

if (empty($id_peminjaman) || empty($metode) || empty($jumlah)) {
    response(false, "Data pembayaran tidak lengkap");
}

$now = date('Ymd');
$stmt = $conn->query("SELECT COUNT(*) FROM pembayaran WHERE DATE(created_at) = CURDATE()");
$count = $stmt->fetchColumn() + 1;
$kode_booking = "BK-" . $now . "-" . str_pad($count, 3, "0", STR_PAD_LEFT);

try {
    // Generate QR String Dummy
    // Generate QR String (URL ke Halaman Konfirmasi Web)
    // Format: http://localhost:5173/pembayaran/konfirmasi/{id_pembayaran}
    // Frontend (React) harus punya route ini.
    $server_url = "http://localhost:5173"; // Sesuaikan dengan port Frontend Anda
    $qr_string = "$server_url/pembayaran/konfirmasi/" . $conn->lastInsertId();

    $stmt = $conn->prepare("INSERT INTO pembayaran (id_peminjaman, jumlah, metode_pembayaran, kode_booking, status_pembayaran) VALUES (?, ?, ?, ?, 'pending')");
    $stmt->execute([$id_peminjaman, $jumlah, $metode, $kode_booking]);
    
    $id = $conn->lastInsertId();
    $stmt = $conn->prepare("SELECT * FROM pembayaran WHERE id_pembayaran = ?");
    $stmt->execute([$id]);
    $pembayaran = $stmt->fetch();
    
    // Tambahkan QR String ke response untuk frontend generate QR Code
    $pembayaran['qr_string'] = $qr_string;

    // Jika Transfer Bank, kirim email instruksi
    if ($metode === 'transfer_bank') {
        // Ambil email user (agak PR karena harus join, tapi ini create payment, session user ada di $_SESSION)
        // Kita ambil email dari session atau query peminjam
        $id_peminjam_session = $_SESSION['user']['id_peminjam'] ?? 0;
        
        // Query email
         $stmtUser = $conn->prepare("SELECT email FROM peminjam WHERE id_peminjam = ?");
         $stmtUser->execute([$id_peminjam_session]);
         $userEmail = $stmtUser->fetchColumn();
         
         if ($userEmail) {
             require_once '../../config/email.php';
             $confirmLink = "$server_url/pembayaran/konfirmasi/" . $id;
             $details = [
                 'kode_booking' => $kode_booking,
                 'jumlah' => $jumlah
             ];
             sendPaymentInstruction($userEmail, $details, $confirmLink);
         }
    }
    
    response(true, "Pembayaran berhasil dibuat", $pembayaran);
} catch (PDOException $e) {
    response(false, "Gagal membuat pembayaran: " . $e->getMessage());
}
?>
