<?php
declare(strict_types=1);
require dirname(__DIR__) . '/http.php';

try {
    mulaiSesi();
    $metode = $_SERVER['REQUEST_METHOD'];
    if ($metode === 'GET') {
        $user = null;
        if (isset($_SESSION['user_id'])) {
            $db = require dirname(__DIR__) . '/database.php';
            $row = akunSesi($db);
            if ($row) $user = profil($row);
            else unset($_SESSION['user_id']);
        }
        balas(['user' => $user, 'csrf' => $_SESSION['csrf']]);
    }
    if ($metode !== 'POST') {
        header('Allow: GET, POST');
        balas(['pesan' => 'Metode tidak diizinkan.'], 405);
    }
    cekCsrf();
    $input = inputJson();
    $aksi = $input['aksi'] ?? '';
    if ($aksi === 'logout') {
        $_SESSION = [];
        $cookie = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 3600, 'path' => $cookie['path'],
            'secure' => $cookie['secure'], 'httponly' => true, 'samesite' => 'Lax',
        ]);
        session_destroy();
        balas(['user' => null, 'csrf' => null, 'pesan' => 'Berhasil keluar.']);
    }
    if ($aksi === 'ganti-password') {
        $db = require dirname(__DIR__) . '/database.php';
        $row = akunSesi($db);
        if (!$row) balas(['pesan' => 'Sesi berakhir. Masuk kembali sebelum mengganti password.'], 401);
        if ((string) $row['id'] !== ($input['akun_id'] ?? '')) balas(['pesan' => 'Akun berubah. Muat ulang halaman.'], 409);
        $lama = $input['password_lama'] ?? null; $baru = $input['password_baru'] ?? null;
        if (!is_string($lama) || !is_string($baru) || strlen($lama) > 72 || strlen($baru) > 72 || mb_strlen($baru) < 12) balas(['pesan' => 'Isi password saat ini dan password baru minimal 12 karakter yang tidak terlalu panjang.'], 422);
        batasiPercobaan('ganti-password');
        $q = $db->prepare('SELECT password_hash FROM users WHERE id = ?'); $q->execute([$row['id']]); $hash = $q->fetchColumn();
        if (!$hash || !password_verify($lama, $hash)) balas(['pesan' => 'Password saat ini salah.'], 401);
        if (password_verify($baru, $hash)) balas(['pesan' => 'Password baru harus berbeda dari password saat ini.'], 422);
        $q = $db->prepare('UPDATE users SET password_hash = ?, wajib_ganti_password = 0, session_version = session_version + 1 WHERE id = ? AND session_version = ? AND password_hash = ?');
        $q->execute([hashPasswordAkun($baru), $row['id'], $row['session_version'], $hash]);
        if ($q->rowCount() !== 1) balas(['pesan' => 'Akun telah berubah pada proses lain. Silakan masuk kembali.'], 409);
        session_regenerate_id(true);
        $_SESSION['auth_version'] = (int) $row['session_version'] + 1;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        $row['wajib_ganti_password'] = 0;
        balas(['user' => profil($row), 'csrf' => $_SESSION['csrf'], 'pesan' => 'Password berhasil diganti.']);
    }
    if (!in_array($aksi, ['login', 'daftar'], true)) balas(['pesan' => 'Aksi tidak dikenal.'], 400);
    $nis = is_string($input['nis'] ?? null) ? trim($input['nis']) : '';
    $password = is_string($input['password'] ?? null) ? $input['password'] : '';
    if (!preg_match('/^[0-9]{1,30}$/D', $nis) || $password === '' || strlen($password) > 72) {
        balas(['pesan' => 'Periksa NIS dan password. NIS berupa angka maksimal 30 digit; password tidak boleh kosong atau terlalu panjang.'], 422);
    }
    batasiPercobaan($aksi);
    $db = require dirname(__DIR__) . '/database.php';
    if ($aksi === 'daftar') {
        $nama = is_string($input['nama'] ?? null) ? trim($input['nama']) : '';
        $kelas = is_string($input['kelas'] ?? null) ? trim($input['kelas']) : '';
        if ($nama === '' || $kelas === '' || mb_strlen($nama) > 100 || mb_strlen($kelas) > 50 || mb_strlen($password) < 12) {
            balas(['pesan' => 'Isi nama (maks. 100 karakter), kelas (maks. 50 karakter), dan password minimal 12 karakter.'], 422);
        }
        $hash = hashPasswordAkun($password);
        try {
            $q = $db->prepare("INSERT INTO users (nama, nis, kelas, password_hash, role) VALUES (?, ?, ?, ?, 'siswa')");
            $q->execute([$nama, $nis, $kelas, $hash]);
        } catch (PDOException $e) {
            if (($e->errorInfo[1] ?? null) === 1062 || ($e->errorInfo[1] ?? null) === 19) balas(['pesan' => 'NIS tersebut sudah terdaftar. Gunakan menu Masuk.'], 409);
            throw $e;
        }
        balas(['pesan' => 'Pendaftaran berhasil. Silakan masuk dengan NIS dan password.'], 201);
    }
    $q = $db->prepare('SELECT id, nama, nis, kelas, password_hash, role, wajib_ganti_password, session_version FROM users WHERE nis = ?');
    $q->execute([$nis]);
    $row = $q->fetch();
    // Hash dummy mengurangi perbedaan waktu antara NIS yang ada dan yang tidak ada.
    $hash = $row['password_hash'] ?? '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
    $valid = password_verify($password, $hash);
    if (!$row || !$valid) balas(['pesan' => 'NIS atau password salah.'], 401);
    session_regenerate_id(true);
    $_SESSION = [];
    $_SESSION['last_seen'] = time();
    $_SESSION['user_id'] = (int) $row['id'];
    $_SESSION['auth_version'] = (int) $row['session_version'];
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    balas(['user' => profil($row), 'csrf' => $_SESSION['csrf']]);
} catch (Throwable $e) {
    error_log($e->getMessage());
    balas(['pesan' => 'Layanan akun belum tersedia. Periksa log terminal PHP.'], 503);
}
