<?php
require_once '../../config/koneksi.php';
require_once '../../config/email.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    response(false, "Method not allowed");
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty($data->email)) {
    http_response_code(400);
    response(false, "Email harus diisi");
}

$email = $data->email;

try {

    $stmt = $conn->prepare("SELECT id_peminjam, nama_peminjam FROM peminjam WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {

        response(false, "Email tidak ditemukan."); // Using specific error as per typical lightly secured app request
    }


    $token = bin2hex(random_bytes(32));

    $update = $conn->prepare("UPDATE peminjam SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id_peminjam = ?");
    $update->execute([$token, $user['id_peminjam']]);


    $resetLink = "http://localhost:8080/reset-password?token=" . $token;
    if (sendResetPasswordEmail($email, $user['nama_peminjam'], $resetLink)) {
        response(true, "Link reset password telah dikirim ke email Anda.");
    } else {
        response(false, "Gagal mengirim email. Silakan coba lagi nanti.");
    }

} catch (PDOException $e) {
    http_response_code(500);
    response(false, "Database error: " . $e->getMessage());
}
?>
