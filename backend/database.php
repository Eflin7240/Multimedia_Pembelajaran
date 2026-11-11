<?php
declare(strict_types=1);

$lokasi = __DIR__ . '/config.local.php';
if (!is_file($lokasi)) {
    throw new RuntimeException('Konfigurasi backend/config.local.php belum dibuat.');
}
$config = require $lokasi;
foreach (['host', 'port', 'database', 'username', 'password'] as $kolom) {
    if (!is_array($config) || !array_key_exists($kolom, $config)) {
        throw new RuntimeException('Konfigurasi koneksi belum lengkap.');
    }
}
$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $config['host'], $config['port'], $config['database']);
return new PDO($dsn, $config['username'], $config['password'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
