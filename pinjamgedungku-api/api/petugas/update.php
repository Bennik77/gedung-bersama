<?php
require_once '../../config/koneksi.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    response(false, "Unauthorized");
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id_petugas'] ?? 0;
$nama = trim($input['nama_petugas'] ?? $input['nama'] ?? '');
$email = trim($input['email'] ?? '');
$jabatan = trim($input['jabatan'] ?? '');
$no_telepon = trim($input['no_telepon'] ?? '');
$password = $input['password'] ?? '';

if (empty($id) || empty($nama) || empty($email) || empty($jabatan)) {
    response(false, "ID, nama, email, dan jabatan wajib diisi");
}

$foto = trim($input['foto'] ?? '');

if ($id <= 2) {
    response(false, "Akun Administrator Utama tidak dapat diubah");
}

try {
    $sql = "UPDATE petugas SET nama_petugas = ?, email = ?, jabatan = ?, no_telepon = ?, foto = ?";
    $params = [$nama, $email, $jabatan, $no_telepon, $foto];
    
    if (!empty($password)) {
        $sql .= ", password = ?";
        $params[] = password_hash($password, PASSWORD_DEFAULT);
    }
    
    $sql .= " WHERE id_petugas = ?";
    $params[] = $id;
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    response(true, "Petugas berhasil diupdate");
} catch (PDOException $e) {
    response(false, "Gagal update petugas: " . $e->getMessage());
}
?>
