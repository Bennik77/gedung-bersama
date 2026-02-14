<?php
require_once '../../config/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    response(false, "Method not allowed");
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->token) || !isset($data->password)) {
    http_response_code(400);
    response(false, "Data tidak lengkap");
}

$token = $data->token;
$password = $data->password;

try {

    $stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE reset_token = ? AND reset_token_expiry > NOW()");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        response(false, "Link reset password tidak valid atau sudah kedaluwarsa.");
    }


    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);


    $update = $conn->prepare("UPDATE peminjam SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id_peminjam = ?");
    $update->execute([$hashedPassword, $user['id_peminjam']]);

    response(true, "Password berhasil diubah. Silakan login dengan password baru.");

} catch (PDOException $e) {
    http_response_code(500);
    response(false, "Database error: " . $e->getMessage());
}
?>
