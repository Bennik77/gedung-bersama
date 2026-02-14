<?php
require_once '../../config/koneksi.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Hanya PUT/POST yang diizinkan");
}

$input = json_decode(file_get_contents("php://input"), true);

$id_peminjam = $input['id_peminjam'] ?? null;
$nama = trim($input['nama_peminjam'] ?? '');
$email = trim($input['email'] ?? '');
$no_telepon = trim($input['no_telepon'] ?? '');
$alamat = trim($input['alamat'] ?? '');

if (!$id_peminjam || !$nama || !$email || !$no_telepon || !$alamat) {
    response(false, "Semua field wajib diisi");
}

try {
    // Cek peminjam exists
    $stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE id_peminjam = ?");
    $stmt->execute([$id_peminjam]);
    if (!$stmt->fetch()) {
        response(false, "Peminjam tidak ditemukan");
    }

    // Cek email duplikat selain punya sendiri
    $stmt = $conn->prepare("SELECT id_peminjam FROM peminjam WHERE email = ? AND id_peminjam != ?");
    $stmt->execute([$email, $id_peminjam]);
    if ($stmt->fetch()) {
        response(false, "Email sudah digunakan oleh pengguna lain");
    }

    // Update
    $stmt = $conn->prepare("
        UPDATE peminjam 
        SET nama_peminjam = ?, email = ?, no_telepon = ?, alamat = ?
        WHERE id_peminjam = ?
    ");
    $stmt->execute([$nama, $email, $no_telepon, $alamat, $id_peminjam]);

    response(true, "Peminjam berhasil diperbarui", [
        'id_peminjam' => $id_peminjam,
        'nama_peminjam' => $nama,
        'email' => $email,
        'no_telepon' => $no_telepon,
        'alamat' => $alamat
    ]);

} catch (Exception $e) {
    response(false, "Terjadi kesalahan: " . $e->getMessage());
}
?>
    $stmt->execute([$nama, $email, $no_telepon, $alamat, $id_peminjam]);
    
    // Update session data
    $_SESSION['user']['nama_peminjam'] = $nama;
    $_SESSION['user']['email'] = $email;
    $_SESSION['user']['no_telepon'] = $no_telepon;
    $_SESSION['user']['alamat'] = $alamat;
    
    response(true, "Profil berhasil diperbarui", [
        "id" => $id_peminjam,
        "nama" => $nama,
        "email" => $email,
        "role" => "peminjam",
        "no_telepon" => $no_telepon,
        "alamat" => $alamat
    ]);
} catch (PDOException $e) {
    response(false, "Gagal update profil: " . $e->getMessage());
}
?>
