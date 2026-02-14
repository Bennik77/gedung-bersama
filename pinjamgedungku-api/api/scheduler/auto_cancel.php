<?php
require_once 'config/koneksi.php';



try {

    
    $sql = "UPDATE peminjaman p
            SET p.status_peminjaman = 'dibatalkan'
            WHERE p.status_peminjaman = 'disetujui' 
            AND p.batas_waktu_bayar < NOW()
            AND NOT EXISTS (
                SELECT 1 FROM pembayaran b 
                WHERE b.id_peminjaman = p.id_peminjaman 
                AND b.status_pembayaran = 'berhasil'
            )";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $count = $stmt->rowCount();
    
    if ($count > 0) {
        echo json_encode(["success" => true, "message" => "$count peminjaman dibatalkan otomatis", "count" => $count]);
    } else {
        echo json_encode(["success" => true, "message" => "Tidak ada peminjaman yang perlu dibatalkan", "count" => 0]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
