<?php
declare(strict_types=1);
require dirname(__DIR__) . '/http.php';
try {
    mulaiSesi();
    if (!isset($_SESSION['user_id'])) balas(['pesan' => 'Masuk sebagai admin terlebih dahulu.'], 401);
    $db = require dirname(__DIR__) . '/database.php';
    $admin = akunSesi($db);
    if (!$admin) balas(['pesan' => 'Sesi berakhir. Masuk kembali.'], 401);
    if ($admin['role'] !== 'admin' || $admin['wajib_ganti_password']) balas(['pesan' => 'Akses khusus admin.'], 403);
    if ((string) $admin['id'] !== ($_SERVER['HTTP_X_ACCOUNT_ID'] ?? '')) balas(['pesan' => 'Akun berubah pada tab lain. Muat ulang halaman.'], 409);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $cari = is_string($_GET['q'] ?? null) ? trim($_GET['q']) : '';
        if (mb_strlen($cari) > 100) balas(['pesan' => 'Pencarian terlalu panjang.'], 422);
        $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT);
        if (!$page || $page < 1 || $page > 10000) balas(['pesan' => 'Halaman tidak valid.'], 422);
        $like = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $cari) . '%';
        $where = "role = 'siswa' AND (nama LIKE ? ESCAPE '!' OR nis LIKE ? ESCAPE '!')";
        $q = $db->prepare('SELECT COUNT(*) FROM users WHERE ' . $where); $q->execute([$like, $like]); $total = (int) $q->fetchColumn();
        $q = $db->prepare('SELECT id, nama, nis, kelas, wajib_ganti_password, created_at FROM users WHERE ' . $where . ' ORDER BY id DESC LIMIT 20 OFFSET ' . (($page - 1) * 20));
        $q->execute([$like, $like]);
        $siswa = array_map(fn($r) => ['id' => (int) $r['id'], 'nama' => $r['nama'], 'nis' => $r['nis'], 'kelas' => $r['kelas'], 'wajibGantiPassword' => (bool) $r['wajib_ganti_password'], 'createdAt' => $r['created_at']], $q->fetchAll(PDO::FETCH_ASSOC));
        balas(['siswa' => $siswa, 'total' => $total, 'page' => $page, 'perPage' => 20]);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: GET, POST'); balas(['pesan' => 'Metode tidak diizinkan.'], 405); }
    cekCsrf(); $in = inputJson();
    if (($in['aksi'] ?? '') !== 'reset-password' || ($in['konfirmasi'] ?? null) !== true) balas(['pesan' => 'Konfirmasi identitas siswa diperlukan.'], 422);
    $target = $in['siswaId'] ?? null; $password = $in['passwordAdmin'] ?? null;
    if (!is_int($target) || $target <= 0 || !is_string($password) || $password === '' || strlen($password) > 72) balas(['pesan' => 'Pilih siswa dan isi password admin saat ini.'], 422);
    batasiPercobaan('admin-reset-password');
    $q = $db->prepare('SELECT password_hash FROM users WHERE id = ?'); $q->execute([$admin['id']]); $hash = $q->fetchColumn();
    if (!$hash || !password_verify($password, $hash)) balas(['pesan' => 'Password admin salah.'], 401);
    $q = $db->prepare("SELECT id, nis, nama, kelas, session_version FROM users WHERE id = ? AND role = 'siswa'"); $q->execute([$target]); $siswa = $q->fetch(PDO::FETCH_ASSOC);
    if (!$siswa) balas(['pesan' => 'Siswa tidak ditemukan. Akun admin tidak dapat direset melalui menu ini.'], 404);
    $sementara = bin2hex(random_bytes(12));
    $db->beginTransaction();
    $q = $db->prepare("UPDATE users SET password_hash = ?, wajib_ganti_password = 1, session_version = session_version + 1 WHERE id = ? AND role = 'siswa' AND session_version = ?");
    $q->execute([hashPasswordAkun($sementara), $target, $siswa['session_version']]);
    if ($q->rowCount() !== 1) { $db->rollBack(); balas(['pesan' => 'Akun siswa berubah pada proses lain. Muat ulang daftar sebelum mencoba lagi.'], 409); }
    $q = $db->prepare("INSERT INTO admin_audit (admin_id, user_id, target_nis, aksi) VALUES (?, ?, ?, 'reset_password')"); $q->execute([$admin['id'], $target, $siswa['nis']]);
    $db->commit();
    balas(['pesan' => 'Password siswa direset. Berikan password sementara secara pribadi setelah memverifikasi identitasnya.', 'passwordSementara' => $sementara, 'siswa' => ['id' => $target, 'nis' => $siswa['nis'], 'nama' => $siswa['nama'], 'kelas' => $siswa['kelas']]]);
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    error_log($e->getMessage());
    balas(['pesan' => 'Layanan admin belum tersedia. Periksa log PHP dan pastikan migrasi-admin.sql sudah dijalankan.'], 503);
}
