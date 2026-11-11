<?php
declare(strict_types=1);

function balas(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

function direktoriPrivat(): string {
    $path = __DIR__ . '/var';
    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) {
        throw new RuntimeException('Folder backend/var tidak dapat dibuat.');
    }
    return $path;
}

function mulaiSesi(): void {
    $path = direktoriPrivat() . '/sessions';
    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) {
        throw new RuntimeException('Folder sesi tidak dapat dibuat.');
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.gc_maxlifetime', '7200');
    session_save_path($path);
    session_name('edusmk_session');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true, 'samesite' => 'Lax',
    ]);
    if (!session_start()) throw new RuntimeException('Sesi tidak dapat dimulai.');
    if (isset($_SESSION['last_seen']) && time() - (int) $_SESSION['last_seen'] > 7200) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['last_seen'] = time();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}

function inputJson(int $batas = 4096): array {
    $tipe = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
    if ($tipe !== 'application/json') balas(['pesan' => 'Gunakan JSON untuk permintaan ini.'], 415);
    $raw = file_get_contents('php://input', false, null, 0, $batas + 1);
    if ($raw === false || strlen($raw) > $batas) balas(['pesan' => 'Data terlalu panjang.'], 413);
    try { $data = json_decode($raw, true, 48, JSON_THROW_ON_ERROR); }
    catch (JsonException) { balas(['pesan' => 'Format data tidak valid.'], 400); }
    if (!is_array($data)) balas(['pesan' => 'Data formulir tidak valid.'], 400);
    return $data;
}

function cekCsrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token)) {
        balas(['pesan' => 'Sesi formulir berubah. Muat ulang halaman lalu coba lagi.'], 403);
    }
}

function batasiPercobaan(string $aksi): void {
    $nama = hash('sha256', $aksi . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'local'));
    $file = fopen(direktoriPrivat() . '/rate-' . $nama . '.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) throw new RuntimeException('Pembatas percobaan tidak tersedia.');
    try {
        $raw = stream_get_contents($file);
        $daftar = json_decode($raw ?: '[]', true);
        $daftar = is_array($daftar) ? array_values(array_filter($daftar, fn($t) => is_int($t) && $t > time() - 900)) : [];
        if (count($daftar) >= 20) {
            header('Retry-After: 900');
            balas(['pesan' => 'Terlalu banyak percobaan. Tunggu 15 menit sebelum mencoba lagi.'], 429);
        }
        $daftar[] = time();
        rewind($file); ftruncate($file, 0); fwrite($file, json_encode($daftar)); fflush($file);
    } finally { flock($file, LOCK_UN); fclose($file); }
}

function profil(array $row): array {
    return ['id' => (int) $row['id'], 'nama' => $row['nama'], 'nis' => $row['nis'], 'kelas' => $row['kelas'], 'role' => $row['role'] === 'admin' ? 'admin' : 'siswa', 'wajibGantiPassword' => (bool) $row['wajib_ganti_password']];
}

function akunSesi(PDO $db): ?array {
    $uid = (int) ($_SESSION['user_id'] ?? 0);
    if (!$uid) return null;
    $q = $db->prepare('SELECT id, nama, nis, kelas, role, wajib_ganti_password, session_version FROM users WHERE id = ?');
    $q->execute([$uid]); $row = $q->fetch(PDO::FETCH_ASSOC);
    if (!$row || (int) ($row['session_version'] ?? 0) !== (int) ($_SESSION['auth_version'] ?? 0)) {
        $_SESSION = ['csrf' => bin2hex(random_bytes(32)), 'last_seen' => time()];
        session_regenerate_id(true);
        return null;
    }
    return $row;
}

function hashPasswordAkun(string $password): string {
    $algoritma = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
    return password_hash($password, $algoritma, $algoritma === PASSWORD_BCRYPT ? ['cost' => 12] : []);
}
