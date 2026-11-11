<?php
declare(strict_types=1);
require dirname(__DIR__) . '/http.php';
require dirname(__DIR__) . '/data-belajar.php';
require dirname(__DIR__) . '/penilaian.php';

try {
    mulaiSesi();
    $uid = (int) ($_SESSION['user_id'] ?? 0);
    if (!$uid) balas(['pesan' => 'Masuk terlebih dahulu untuk mengakses hasil belajar.'], 401);
    if ((string) $uid !== ($_SERVER['HTTP_X_ACCOUNT_ID'] ?? '')) balas(['pesan' => 'Akun berubah pada tab lain. Muat ulang halaman sebelum melanjutkan.'], 409);
    $db = require dirname(__DIR__) . '/database.php';
    $akun = akunSesi($db);
    if (!$akun) balas(['pesan' => 'Sesi berakhir atau password telah direset. Masuk kembali.'], 401);
    if ($akun['wajib_ganti_password']) balas(['pesan' => 'Ganti password sementara sebelum mengakses data belajar.'], 403);
    $snapshot = snapshotBelajar($db, $uid);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') balas(['data' => $snapshot]);
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: GET, POST'); balas(['pesan' => 'Metode tidak diizinkan.'], 405); }
    cekCsrf(); $in = inputJson(262144); $aksi = $in['aksi'] ?? '';
    if ($aksi === 'fase') {
        $id = $in['modulId'] ?? ''; $fase = $in['fase'] ?? '';
        $kolom = ['konseptual' => 'materi_selesai', 'interaktif' => 'simulasi_selesai'];
        if (!preg_match('/^mod-0[1-5]$/D', $id) || !isset($kolom[$fase])) balas(['pesan' => 'Fase/modul tidak dikenal.'], 422);
        $db->beginTransaction(); rowModul($db, $uid, $id);
        $db->prepare('UPDATE progres_modul SET ' . $kolom[$fase] . ' = 1 WHERE user_id = ? AND modul_id = ?')->execute([$uid, $id]);
        $db->commit(); balas(['data' => snapshotBelajar($db, $uid)]);
    }
    if ($aksi === 'modul') {
        $id = $in['modulId'] ?? ''; $bank = bankBelajar()['modul'][$id] ?? null;
        if (!$bank || !is_array($in['jawaban'] ?? null)) balas(['pesan' => 'Jawaban/modul tidak dikenal.'], 422);
        $nomor = (int) substr($id, -2);
        if ($nomor > 1 && (($snapshot['modul'][sprintf('mod-%02d', $nomor - 1)]['skor'] ?? 0) < 75)) balas(['pesan' => 'Lulus kuis modul sebelumnya terlebih dahulu.'], 403);
        $nilai = nilaiModul($bank, $in['jawaban']);
        $db->beginTransaction(); $lama = rowModul($db, $uid, $id);
        $rekor = $lama['skor_terbaik'] === null || $nilai['nilai'] > (float) $lama['skor_terbaik'];
        if ($rekor) $db->prepare('UPDATE progres_modul SET skor_terbaik = ?, detail_kuis = ?, kuis_selesai = 1 WHERE user_id = ? AND modul_id = ?')->execute([$nilai['nilai'], json_encode($nilai, JSON_THROW_ON_ERROR), $uid, $id]);
        else $db->prepare('UPDATE progres_modul SET kuis_selesai = 1 WHERE user_id = ? AND modul_id = ?')->execute([$uid, $id]);
        $db->commit(); balas(['hasil' => $nilai, 'rekorBaru' => $rekor, 'data' => snapshotBelajar($db, $uid)]);
    }
    if ($aksi === 'kasus') {
        $k = bankBelajar()['level'][$in['kasusId'] ?? ''] ?? null;
        if (!$k) balas(['pesan' => 'Kasus tidak ditemukan.'], 422);
        cekLevel($snapshot, $k['level']);
        $_SESSION['kasus_terakhir'][$k['level']] = $k['id'];
        balas(['data' => snapshotBelajar($db, $uid)]);
    }
    if ($aksi === 'tantangan') {
        $attempt = $in['attemptId'] ?? '';
        if (!is_string($attempt) || !preg_match('/^[a-zA-Z0-9-]{16,64}$/D', $attempt)) balas(['pesan' => 'ID percobaan tidak valid.'], 422);
        $q = $db->prepare('SELECT level, jawaban FROM hasil_tantangan WHERE user_id = ? AND attempt_id = ?'); $q->execute([$uid, $attempt]); $ada = $q->fetch(PDO::FETCH_ASSOC);
        if ($ada) balas(['penilaian' => json_decode($ada['jawaban'], true, 48, JSON_THROW_ON_ERROR), 'data' => $snapshot, 'level' => $ada['level']]);
        $k = bankBelajar()['level'][$in['kasus']['id'] ?? ''] ?? null;
        if (!$k || !is_array($in['jawaban'] ?? null)) balas(['pesan' => 'Kasus/jawaban tidak valid.'], 422);
        cekLevel($snapshot, $k['level']);
        $durasi = $in['durasiDetik'] ?? 0;
        if (!is_int($durasi) || $durasi < 0 || $durasi > 86400) balas(['pesan' => 'Durasi tidak valid.'], 422);
        batasiPercobaan('simpan-tantangan');
        $nilai = nilaiLevel($k, $in['jawaban'], $in['kasus']);
        $salinan = $nilai['snapshot']; unset($nilai['snapshot']);
        $q = $db->prepare('INSERT INTO hasil_tantangan (user_id, level, kasus_id, snapshot_kasus, jawaban, nilai, durasi_detik, attempt_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $q->execute([$uid, $k['level'], $k['id'], json_encode($salinan, JSON_THROW_ON_ERROR), json_encode($nilai, JSON_THROW_ON_ERROR), $nilai['nilai'], $durasi, $attempt]);
        balas(['penilaian' => $nilai, 'data' => snapshotBelajar($db, $uid), 'level' => $k['level']]);
    }
    balas(['pesan' => 'Aksi tidak dikenal.'], 400);
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    error_log($e->getMessage());
    balas(['pesan' => 'Data belajar belum tersimpan. Periksa koneksi PHP/MySQL dan jalankan migrasi-data-akun.sql.'], 503);
}
