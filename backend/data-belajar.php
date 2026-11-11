<?php
declare(strict_types=1);

function bintangNilai(float $nilai): int {
    return $nilai >= 100 ? 4 : ($nilai >= 75 ? 3 : ($nilai >= 50 ? 2 : ($nilai >= 25 ? 1 : 0)));
}
function snapshotBelajar(PDO $db, int $uid): array {
    $q = $db->prepare('SELECT modul_id, materi_selesai, simulasi_selesai, kuis_selesai, skor_terbaik, detail_kuis, updated_at FROM progres_modul WHERE user_id = ?');
    $q->execute([$uid]); $modul = []; $poin = 0; $bintang = 0;
    foreach ($q->fetchAll(PDO::FETCH_ASSOC) as $r) {
        if (!preg_match('/^mod-0[1-5]$/D', $r['modul_id'])) continue;
        $nilai = $r['skor_terbaik'] === null ? null : (float) $r['skor_terbaik'];
        $modul[$r['modul_id']] = [
            'skor' => $nilai, 'konseptual' => (bool) $r['materi_selesai'], 'interaktif' => (bool) $r['simulasi_selesai'],
            'evaluasi' => $nilai !== null && $nilai >= 75, 'dikerjakan' => (bool) $r['kuis_selesai'],
            'detail' => $r['detail_kuis'] ? json_decode($r['detail_kuis'], true, 48, JSON_THROW_ON_ERROR) : null,
            'updatedAt' => $r['updated_at'],
        ];
        $poin += $nilai ?? 0; $bintang += bintangNilai($nilai ?? 0);
    }
    $q = $db->prepare('SELECT id, level, kasus_id, nilai, durasi_detik, created_at, jawaban FROM hasil_tantangan WHERE user_id = ? ORDER BY id ASC');
    $q->execute([$uid]); $riwayat = ['terakhir' => [], 'hasil' => []]; $percobaan = [];
    foreach ($q->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $meta = json_decode($r['jawaban'], true, 48, JSON_THROW_ON_ERROR);
        $level = $r['level']; $skor = (float) $r['nilai'];
        $hasil = ['nilai' => $skor, 'benar' => (int) ($meta['benar'] ?? 0), 'total' => (int) ($meta['total'] ?? ($level === 'hard' ? 15 : 10)), 'kasus' => $r['kasus_id'], 'selesaiPada' => $r['created_at'], 'durasiDetik' => (int) $r['durasi_detik'], 'terbaik' => max($skor, $riwayat['hasil'][$level]['terbaik'] ?? 0)];
        $riwayat['terakhir'][$level] = $r['kasus_id']; $riwayat['hasil'][$level] = $hasil;
        $percobaan[] = ['id' => (int) $r['id'], 'level' => $level] + $hasil;
    }
    foreach ($_SESSION['kasus_terakhir'] ?? [] as $level => $id) $riwayat['terakhir'][$level] = $id;
    return ['versi' => 1, 'userId' => $uid, 'modul' => $modul, 'capaian' => ['poin' => round($poin, 2), 'bintang' => $bintang], 'riwayat' => $riwayat, 'percobaan' => array_reverse(array_slice($percobaan, -10))];
}
function rowModul(PDO $db, int $uid, string $id): array {
    // Pastikan baris tersedia, lalu kunci selama pembaruan nilai terbaik.
    $sql = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite'
        ? 'INSERT OR IGNORE INTO progres_modul (user_id, modul_id) VALUES (?, ?)'
        : 'INSERT INTO progres_modul (user_id, modul_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)';
    $db->prepare($sql)->execute([$uid, $id]);
    $sql = 'SELECT * FROM progres_modul WHERE user_id = ? AND modul_id = ?';
    if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) !== 'sqlite') $sql .= ' FOR UPDATE';
    $q = $db->prepare($sql); $q->execute([$uid, $id]); return $q->fetch(PDO::FETCH_ASSOC);
}
function cekLevel(array $snapshot, string $level): void {
    $syarat = ['easy' => [8,200], 'medium' => [14,350], 'hard' => [18,450]];
    if (!isset($syarat[$level])) balas(['pesan' => 'Level tidak dikenal.'], 422);
    [$bintang, $poin] = $syarat[$level];
    if ($snapshot['capaian']['bintang'] < $bintang || $snapshot['capaian']['poin'] < $poin) balas(['pesan' => 'Capaian kuis modul akun ini belum memenuhi syarat level.'], 403);
}
