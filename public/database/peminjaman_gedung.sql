-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: peminjaman_gedung
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gedung`
--

DROP TABLE IF EXISTS `gedung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gedung` (
  `id_gedung` int(11) NOT NULL AUTO_INCREMENT,
  `nama_gedung` varchar(150) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `kapasitas` int(11) NOT NULL,
  `harga_sewa` decimal(15,2) NOT NULL DEFAULT 0.00,
  `fasilitas` text DEFAULT NULL,
  `status` enum('tersedia','tidak_tersedia') DEFAULT 'tersedia',
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `koordinator_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_gedung`),
  KEY `koordinator_id` (`koordinator_id`),
  CONSTRAINT `gedung_ibfk_1` FOREIGN KEY (`koordinator_id`) REFERENCES `petugas` (`id_petugas`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gedung`
--

LOCK TABLES `gedung` WRITE;
/*!40000 ALTER TABLE `gedung` DISABLE KEYS */;
INSERT INTO `gedung` VALUES (1,'Gedung Serbaguna Utama','Jl. Sudirman No. 1, Jakarta Pusat',500,5000000.00,'AC, Sound System, Proyektor, Panggung','tersedia','Gedung utama dengan fasilitas lengkap, cocok untuk acara besar seperti seminar, pernikahan, dan konser.','https://images.unsplash.com/photo-1519167758481-83f550bb4db1',3,'2026-02-06 03:57:04','2026-02-06 04:23:21'),(2,'Aula Pertemuan A','Jl. Gatot Subroto No. 15, Jakarta Selatan',100,1500000.00,'AC, Proyektor, Whiteboard','tersedia','Ruang pertemuan dengan AC dan proyektor, ideal untuk rapat dan workshop skala menengah.','https://images.unsplash.com/photo-1431540015161-0bf868a2d407',3,'2026-02-06 03:57:04','2026-02-06 04:23:25'),(3,'Grand Ballroom Kencana','Jl. Thamrin No. 8, Jakarta Pusat',1000,15000000.00,'Full AC, Carpet, VIP Room, Parking','tersedia','Ballroom mewah untuk pernikahan dan event korporat.','https://images.unsplash.com/photo-1519750783826-e2420f4d687f',3,'2026-02-06 03:57:04','2026-02-06 04:23:30'),(4,'Ruang Seminar B','Jl. Rasuna Said Kav. 22',50,750000.00,'AC, Kursi Kuliah, Sound Portable','tersedia','Ruangan minimalis untuk seminar kecil atau training.','https://images.unsplash.com/photo-1497366216548-37526070297c',NULL,'2026-02-06 03:57:04','2026-02-06 03:57:04'),(5,'Outdoor Garden Space','Jl. Kemang Raya No. 10',200,3000000.00,'Taman, Listrik Outdoor, Toilet','tersedia','Area outdoor yang asri untuk garden party atau bazaar.','https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9',NULL,'2026-02-06 03:57:04','2026-02-06 03:57:04'),(6,'Meeting Room VVIP','Jl. Senopati No. 45',20,2000000.00,'Meja Bundar, Kursi Exec, Video Conf','tersedia','Ruang rapat eksklusif dengan privasi tinggi.','https://images.unsplash.com/photo-1577412647305-991150c7d163',NULL,'2026-02-06 03:57:04','2026-02-06 03:57:04'),(7,'Gedung Olahraga Cendrawasih','Jl. Pemuda No. 88',800,4000000.00,'Tribun, Locker Room, Lampu Sorot','tidak_tersedia','GOR untuk pertandingan olahraga dan event komunitas.','https://images.unsplash.com/photo-1534438327276-14e5300c3a48',NULL,'2026-02-06 03:57:04','2026-02-06 03:57:04'),(8,'Studio Kreatif Bersama','Jl. Cipete Raya No. 5',30,500000.00,'Green Screen, Lighting, Audio Mixer','tersedia','Studio untuk photoshoot atau produksi konten.','https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',NULL,'2026-02-06 03:57:04','2026-02-06 03:57:04');
/*!40000 ALTER TABLE `gedung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pembayaran`
--

DROP TABLE IF EXISTS `pembayaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pembayaran` (
  `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT,
  `id_peminjaman` int(11) NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `metode_pembayaran` enum('qris','transfer_bank') NOT NULL,
  `status_pembayaran` enum('pending','berhasil','gagal') DEFAULT 'pending',
  `kode_booking` varchar(50) NOT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `tanggal_pembayaran` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_pembayaran`),
  KEY `id_peminjaman` (`id_peminjaman`),
  CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman` (`id_peminjaman`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pembayaran`
--

LOCK TABLES `pembayaran` WRITE;
/*!40000 ALTER TABLE `pembayaran` DISABLE KEYS */;
INSERT INTO `pembayaran` VALUES (7,11,5000000.00,'qris','','BK-20260206-001',NULL,'2026-02-06 12:59:42','2026-02-06 05:59:39','2026-02-06 06:00:02');
/*!40000 ALTER TABLE `pembayaran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peminjam`
--

DROP TABLE IF EXISTS `peminjam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peminjam` (
  `id_peminjam` int(11) NOT NULL AUTO_INCREMENT,
  `nama_peminjam` varchar(100) NOT NULL,
  `no_telepon` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `alamat` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_peminjam`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peminjam`
--

LOCK TABLES `peminjam` WRITE;
/*!40000 ALTER TABLE `peminjam` DISABLE KEYS */;
INSERT INTO `peminjam` VALUES (1,'Budi Santoso','081234567891','budi@email.com','Jl. Merdeka No. 10, Jakarta','$2y$10$/NlmIL8EzTKs/49v9wa6.eAM7Hq4att4RquP9dPv1nZig81G6sUKK',NULL,NULL,1,NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(2,'Siti Aminah','081987654321','siti@email.com','Jl. Mawar No. 3, Bandung','$2y$10$/NlmIL8EzTKs/49v9wa6.eAM7Hq4att4RquP9dPv1nZig81G6sUKK',NULL,NULL,1,NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(3,'Andi Pratama','085678901234','andi@email.com','Jl. Melati No. 5, Surabaya','$2y$10$/NlmIL8EzTKs/49v9wa6.eAM7Hq4att4RquP9dPv1nZig81G6sUKK',NULL,NULL,0,NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(4,'Rina Wati','081345678901','rina@email.com','Jl. Kenanga No. 7, Yogyakarta','$2y$10$/NlmIL8EzTKs/49v9wa6.eAM7Hq4att4RquP9dPv1nZig81G6sUKK',NULL,NULL,1,NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(5,'PT Event Organizer Jaya','0217890123','info@eojaya.com','Gedung Cyber Lt. 2, Jakarta','$2y$10$/NlmIL8EzTKs/49v9wa6.eAM7Hq4att4RquP9dPv1nZig81G6sUKK',NULL,NULL,1,NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(7,'Benyamin Niko','085782116995','benjaminarxv@gmail.com','Villa Mutiara Gading 1, Jalan Mutiara Gading Raya Blok G3 No. 15, Setia Asih, Tarumajaya','$2y$10$o4fgZain8jV2savWBFkyPOcI5tt/Zuv/4tJa65oqZ.5CGgKqDY.D6',NULL,NULL,1,NULL,'2026-02-06 04:46:01','2026-02-06 04:46:36');
/*!40000 ALTER TABLE `peminjam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peminjaman`
--

DROP TABLE IF EXISTS `peminjaman`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peminjaman` (
  `id_peminjaman` int(11) NOT NULL AUTO_INCREMENT,
  `id_peminjam` int(11) NOT NULL,
  `id_gedung` int(11) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `tujuan_acara` text NOT NULL,
  `status_peminjaman` enum('menunggu','disetujui','ditolak') DEFAULT 'menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_peminjaman`),
  KEY `id_peminjam` (`id_peminjam`),
  KEY `id_gedung` (`id_gedung`),
  CONSTRAINT `peminjaman_ibfk_1` FOREIGN KEY (`id_peminjam`) REFERENCES `peminjam` (`id_peminjam`) ON DELETE CASCADE,
  CONSTRAINT `peminjaman_ibfk_2` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peminjaman`
--

LOCK TABLES `peminjaman` WRITE;
/*!40000 ALTER TABLE `peminjaman` DISABLE KEYS */;
INSERT INTO `peminjaman` VALUES (11,7,1,'2026-02-12','2026-02-12','1','disetujui','2026-02-06 05:59:13','2026-02-06 05:59:31');
/*!40000 ALTER TABLE `peminjaman` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persetujuan`
--

DROP TABLE IF EXISTS `persetujuan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persetujuan` (
  `id_persetujuan` int(11) NOT NULL AUTO_INCREMENT,
  `id_peminjaman` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_persetujuan` datetime NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_persetujuan`),
  UNIQUE KEY `id_peminjaman` (`id_peminjaman`),
  KEY `id_petugas` (`id_petugas`),
  CONSTRAINT `persetujuan_ibfk_1` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman` (`id_peminjaman`) ON DELETE CASCADE,
  CONSTRAINT `persetujuan_ibfk_2` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_petugas`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persetujuan`
--

LOCK TABLES `persetujuan` WRITE;
/*!40000 ALTER TABLE `persetujuan` DISABLE KEYS */;
INSERT INTO `persetujuan` VALUES (8,11,1,'2026-02-06 12:59:31','1','2026-02-06 05:59:31');
/*!40000 ALTER TABLE `persetujuan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `petugas`
--

DROP TABLE IF EXISTS `petugas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `petugas` (
  `id_petugas` int(11) NOT NULL AUTO_INCREMENT,
  `nama_petugas` varchar(100) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `no_telepon` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_petugas`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `petugas`
--

LOCK TABLES `petugas` WRITE;
/*!40000 ALTER TABLE `petugas` DISABLE KEYS */;
INSERT INTO `petugas` VALUES (1,'Admin Sistem','Administrator','081234567890','admin@peminjaman.id','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(2,'Ahmad Yusuf','Koordinator Gedung','081234567893','ahmad@peminjaman.id','$2y$10$nYvBB.glEmLBJ7zgArf7DOsBGUFEOQE4tsa1G3YgkiPWlrP7YQake',NULL,'2026-02-06 03:57:04','2026-02-06 04:07:56'),(3,'Naelza','Petugas Kece','1234567890','battleroyalgamer1@gmail.com','$2y$10$1BBGsiS4mbsqZ1O0DoReX.UZ/jdaTdf1mAZigoNCNE7OyMmZajuVu','https://example.com/foto.jpg','2026-02-06 04:20:15','2026-02-06 04:20:15');
/*!40000 ALTER TABLE `petugas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-06 13:15:22
