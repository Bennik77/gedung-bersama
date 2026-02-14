<?php
require_once '../../config/koneksi.php';
session_start();
session_destroy();
response(true, "Logout berhasil");
?>
