<?php
declare(strict_types=1);
require dirname(__DIR__) . '/http.php';
try {
    $db = require dirname(__DIR__) . '/database.php';
    $db->query('SELECT id FROM users LIMIT 1');
    balas(['berhasil' => true, 'pesan' => 'Koneksi database dan akses tabel users berhasil.']);
} catch (Throwable $e) {
    error_log($e->getMessage());
    balas(['berhasil' => false, 'pesan' => 'Koneksi gagal. Periksa konfigurasi dan log terminal PHP.'], 503);
}
