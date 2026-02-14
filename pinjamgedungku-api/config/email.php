<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Gunakan path absolut agar aman saat dipanggil dari folder lain via require
require_once __DIR__ . '/../vendor/autoload.php';

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

/**
 * Base function to send email via SMTP
 */
function sendEmail($to, $subject, $bodyHTML) {
    if (empty($to)) return false;
    
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USERNAME'] ?? '';
        $mail->Password   = $_ENV['SMTP_PASSWORD'] ?? '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $_ENV['SMTP_PORT'] ?? 587;

        $mail->setFrom($_ENV['SMTP_FROM_EMAIL'] ?? 'no-reply@pinjamgedungku.com', $_ENV['SMTP_FROM_NAME'] ?? 'PinjamGedungKu');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $bodyHTML;
        $mail->AltBody = strip_tags($bodyHTML);

        $mail->send();
        
        return true;
    } catch (Exception $e) {
        file_put_contents(__DIR__ . "/../../email_log_error.txt", "Error sending to $to: {$mail->ErrorInfo}\n", FILE_APPEND);
        return false;
    }
}

/**
 * Helper: Email Verification
 */
function sendVerificationEmail($email, $code) {
    $subject = 'Kode Verifikasi PinjamGedungKu';
    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>
            <div style='text-align: center; margin-bottom: 32px;'>
                 <div style='background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;'>
                    <span style='color: white; font-size: 32px; font-weight: bold; line-height: 64px; display: block; width: 100%; text-align: center;'>P</span>
                 </div>
                 <h2 style='color: #1e293b; margin: 0; font-size: 24px;'>Verifikasi Akun</h2>
            </div>
            <p style='color: #475569; font-size: 16px; line-height: 1.6;'>Halo,</p>
            <p style='color: #475569; font-size: 16px; line-height: 1.6;'>Terima kasih telah bergabung. Masukkan kode di bawah ini untuk mengaktifkan akun Anda:</p>
            <div style='text-align: center; margin: 40px 0;'>
                <div style='display: inline-block; padding: 20px 40px; background-color: #f8fafc; border: 2px dashed #4f46e5; border-radius: 16px;'>
                    <span style='font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;'>$code</span>
                </div>
            </div>
            <p style='color: #64748b; font-size: 14px; text-align: center;'>Jangan berikan kode ini kepada siapapun.</p>
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " PinjamGedungKu. Semua hak dilindungi.</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

/**
 * Helper: Reset Password
 */
function sendResetPasswordEmail($email, $name, $link) {
    $subject = 'Reset Password - PinjamGedungku';
    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;'>
            <div style='text-align: center; margin-bottom: 32px;'>
                 <h2 style='color: #1e293b; margin: 0; font-size: 24px;'>Atur Ulang Kata Sandi</h2>
            </div>
            <p style='color: #475569; font-size: 16px; line-height: 1.6;'>Halo <b>$name</b>,</p>
            <p style='color: #475569; font-size: 16px; line-height: 1.6;'>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Klik tombol di bawah ini:</p>
            <div style='text-align: center; margin: 40px 0;'>
                <a href='$link' style='display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);'>Reset Password</a>
            </div>
            <p style='color: #64748b; font-size: 14px;'>Tautan ini berlaku selama 1 jam.</p>
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " PinjamGedungKu.</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

/**
 * Helper: Receipt / Struk Pembayaran
 */
function sendReceiptEmail($to, $data) {
    $subject = "Struk Pembayaran - {$data['kode_booking']}";
    $formattedTotal = "Rp " . number_format($data['jumlah'], 0, ',', '.');
    $koordinator = $data['nama_koordinator'] ?? 'Admin Pusat';
    $telp = $data['telp_koordinator'] ?? '081234567890';

    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;'>
            <div style='text-align: center; margin-bottom: 32px;'>
                <h2 style='color: #10b981; margin: 0; font-size: 24px;'>Pembayaran Berhasil! ✅</h2>
            </div>
            <p style='color: #475569; font-size: 16px;'>Halo <b>{$data['nama_peminjam']}</b>,</p>
            <p style='color: #475569; font-size: 16px;'>Berikut adalah detail transaksi untuk pesanan Anda:</p>
            
            <div style='background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px solid #f1f5f9;'>
                <table border='0' cellpadding='10' style='width: 100%; font-size: 14px; color: #475569;'>
                    <tr><td style='border-bottom: 1px solid #f1f5f9;'>Kode Booking</td><td style='text-align: right; border-bottom: 1px solid #f1f5f9;'><b>{$data['kode_booking']}</b></td></tr>
                    <tr><td style='border-bottom: 1px solid #f1f5f9;'>Gedung</td><td style='text-align: right; border-bottom: 1px solid #f1f5f9;'>{$data['nama_gedung']}</td></tr>
                    <tr><td style='border-bottom: 1px solid #f1f5f9;'>Total</td><td style='text-align: right; color: #10b981; font-weight: bold; border-bottom: 1px solid #f1f5f9;'>$formattedTotal</td></tr>
                    <tr><td>Tanggal</td><td style='text-align: right;'>" . date('d M Y H:i', strtotime($data['tanggal_pembayaran'])) . "</td></tr>
                </table>
            </div>

            <div style='padding: 20px; background-color: #f0f9ff; border-radius: 16px;'>
                <h4 style='margin-top: 0; color: #0369a1;'>👮‍♂️ Petugas Lapangan</h4>
                <p style='margin-bottom: 0; font-size: 14px; color: #0c4a6e;'>Silakan hubungi petugas untuk koordinasi gedung:<br><b>$koordinator</b> ($telp)</p>
            </div>
            
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " PinjamGedungKu.</p>
        </div>
    ";
    return sendEmail($to, $subject, $body);
}

/**
 * Helper: Task Notification for Officers
 */
function sendTaskEmail($to, $data) {
    if (empty($to)) return false;
    $subject = "[Tugas] Booking Baru - {$data['nama_gedung']}";
    
    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;'>
            <div style='text-align: center; margin-bottom: 32px;'>
                <h2 style='color: #4f46e5; margin: 0; font-size: 24px;'>Tugas Baru! 📋</h2>
            </div>
            <p style='color: #475569; font-size: 16px;'>Halo <b>{$data['nama_koordinator']}</b>,</p>
            <p style='color: #475569; font-size: 16px;'>Anda mendapat tugas koordinasi gedung untuk pesanan baru.</p>
            
            <div style='background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px solid #f1f5f9;'>
                <p style='margin: 0; font-size: 14px;'><b>Penyewa:</b><br>{$data['nama_peminjam']} ({$data['telp_peminjam']})</p>
                <hr style='border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;'>
                <p style='margin: 0; font-size: 14px;'><b>Gedung:</b><br>{$data['nama_gedung']}</p>
                <p style='margin: 12px 0 0; font-size: 14px;'><b>Jadwal:</b><br>{$data['tanggal_mulai']} s/d {$data['tanggal_selesai']}</p>
            </div>
            
            <p style='color: #64748b; font-size: 14px;'>Mohon siapkan gedung sesuai jadwal.</p>
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>Sistem PinjamGedungKu</p>
        </div>
    ";
    return sendEmail($to, $subject, $body);
}

/**
 * Helper: Refund Status (Approved/Rejected)
 */
function sendRefundStatusEmail($to, $name, $data) {
    $isApproved = $data['status'] === 'approved' || $data['status'] === 'refunded';
    $subject = $isApproved ? "Refund Disetujui - PinjamGedungKu" : "Status Refund - PinjamGedungKu";
    $formattedAmount = "Rp " . number_format($data['amount'], 0, ',', '.');
    
    $statusColor = $isApproved ? '#10b981' : '#ef4444';
    $statusText = $isApproved ? 'DISETUJUI ✓' : 'DITOLAK ✗';

    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;'>
            <h2 style='color: #1e293b; text-align: center; margin-bottom: 32px;'>Status Pengajuan Refund</h2>
            <p style='color: #475569;'>Halo <b>$name</b>,</p>
            <p style='color: #475569;'>" . ($isApproved ? "Kabar baik! Pengajuan refund Anda telah disetujui." : "Permintaan refund Anda telah kami tinjau.") . "</p>
            
            <div style='background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #f1f5f9; margin: 24px 0;'>
                <table border='0' cellpadding='10' style='width: 100%; font-size: 14px; color: #475569;'>
                    <tr><td>Kode Booking</td><td style='text-align: right;'><b>{$data['kode_booking']}</b></td></tr>
                    <tr><td>Jumlah Refund</td><td style='text-align: right; font-weight: bold;'>$formattedAmount</td></tr>
                    <tr><td>Status</td><td style='text-align: right; color: $statusColor; font-weight: bold;'>$statusText</td></tr>
                </table>
            </div>
            " . ($isApproved ? 
                "<p style='color: #64748b; font-size: 14px;'>Dana akan dikembalikan dalam waktu 3-5 hari kerja.</p>" : 
                "<p style='color: #64748b; font-size: 14px;'>Alasan: " . ($data['reason'] ?? 'Tidak memenuhi syarat & ketentuan.') . "</p>") . "
            
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " PinjamGedungKu.</p>
        </div>
    ";
    return sendEmail($to, $subject, $body);
}

/**
 * Helper: Refund Notification (Requested)
 */
function sendRefundRequestedEmail($to, $name, $data) {
    $subject = "Permintaan Refund Diterima - PinjamGedungku";
    $formattedAmount = "Rp " . number_format($data['amount'], 0, ',', '.');
    
    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;'>
            <h2 style='color: #1e293b; text-align: center; margin-bottom: 32px;'>Refund Sedang Diproses</h2>
            <p style='color: #475569;'>Halo <b>$name</b>,</p>
            <p style='color: #475569;'>Permintaan refund Anda telah kami terima. Kami akan segera meninjau pengajuan Anda.</p>
            
            <div style='background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #f1f5f9; margin: 24px 0;'>
                <table border='0' cellpadding='10' style='width: 100%; font-size: 14px; color: #475569;'>
                    <tr><td>ID Peminjaman</td><td>: {$data['id_peminjaman']}</td></tr>
                    <tr><td>Estimasi Refund</td><td style='color: #4f46e5; font-weight: bold;'>: $formattedAmount</td></tr>
                    <tr><td>Status</td><td>: <b>Menunggu Peninjauan</b></td></tr>
                </table>
            </div>
            
            <p style='color: #64748b; font-size: 14px;'>Proses peninjauan biasanya memakan waktu 1-2 hari kerja.</p>
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " PinjamGedungKu.</p>
        </div>
    ";
    return sendEmail($to, $subject, $body);
}

/**
 * Helper: Payment Instruction
 */
function sendPaymentInstruction($to, $details, $confirmLink) {
    if (empty($to)) return false;
    $subject = 'Instruksi Pembayaran - ' . $details['kode_booking'];
    $formattedTotal = "Rp " . number_format($details['jumlah'], 0, ',', '.');
    
    $body = "
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;'>
            <div style='text-align: center; margin-bottom: 32px;'>
                <h2 style='color: #f59e0b; margin: 0; font-size: 24px;'>Selesaikan Pembayaran ⏳</h2>
            </div>
            <p style='color: #475569; font-size: 16px;'>Halo,</p>
            <p style='color: #475569;'>Terima kasih telah melakukan booking. Silakan selesaikan pembayaran agar jadwal tidak diambil orang lain.</p>
            
            <div style='background-color: #fffbeb; padding: 24px; border-radius: 16px; border: 1px solid #fef3c7; margin: 24px 0;'>
                <table border='0' cellpadding='5' style='width: 100%; font-size: 14px;'>
                    <tr><td>Kode Booking</td><td style='text-align: right;'><b>{$details['kode_booking']}</b></td></tr>
                    <tr><td>Total Tagihan</td><td style='text-align: right; color: #b45309; font-weight: bold;'>$formattedTotal</td></tr>
                </table>
            </div>

            <div style='text-align: center; padding: 24px; border: 2px solid #f1f5f9; border-radius: 16px;'>
                <p style='margin: 0 0 12px; color: #64748b; font-size: 12px;'>Kirim ke Rekening:</p>
                <p style='margin: 0; font-size: 24px; font-weight: bold; color: #1e293b;'>BCA 1234567890</p>
                <p style='margin: 8px 0 0; font-size: 14px; color: #475569;'>a.n PinjamGedungKu</p>
            </div>

            <div style='text-align: center; margin: 40px 0;'>
                <a href='$confirmLink' style='display: inline-block; padding: 18px 40px; background: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);'>Konfirmasi Pembayaran</a>
            </div>
            
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>Ingat untuk melampirkan bukti transfer saat konfirmasi.</p>
            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;'>
            <p style='color: #94a3b8; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " PinjamGedungKu.</p>
        </div>
    ";
    return sendEmail($to, $subject, $body);
}
?>
