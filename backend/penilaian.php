<?php
declare(strict_types=1);

function bankBelajar(): array {
    static $bank;
    return $bank ??= json_decode(file_get_contents(__DIR__ . '/bank-belajar.json'), true, 64, JSON_THROW_ON_ERROR);
}
function namaErd(string $s): string { return trim(preg_replace('/[^a-z0-9_]+/', '_', strtolower(trim($s))), '_') ?: 'tanpa_nama'; }
function cocokErd(string $s, string $kata): bool {
    foreach (explode('|', $kata) as $k) if (str_contains(namaErd($s), strtolower(trim($k)))) return true;
    return false;
}
function aturanErd(string $id, array $erd): bool {
    $entitas = $erd['entitas'] ?? []; $relasi = $erd['relasi'] ?? [];
    $cari = fn($key) => array_values(array_filter($entitas, fn($e) => ($e['id'] ?? null) === $key))[0] ?? null;
    $p = explode('-', $id);
    if ($id === 'pk') return count($entitas) > 0 && count(array_filter($entitas, fn($e) => count(array_filter($e['atribut'] ?? [], fn($a) => ($a['pk'] ?? false) === true)) > 0)) === count($entitas);
    if ($id === 'tanpa-nm') return count($relasi) > 0 && count(array_filter($relasi, fn($r) => ($r['kardinalitas'] ?? '') === 'N:M')) === 0;
    if ($id === 'fk') {
        $rs = array_values(array_filter($relasi, fn($r) => ($r['kardinalitas'] ?? '') === '1:N'));
        if (!$rs) return false;
        foreach ($rs as $r) if (!array_filter($cari($r['ke'])['atribut'] ?? [], fn($a) => ($a['fk'] ?? null) === $r['dari'])) return false;
        return true;
    }
    if ($p[0] === 'tabel') {
        foreach (array_slice($p, 1) as $kata) if (!array_filter($entitas, fn($e) => cocokErd($e['nama'] ?? '', $kata))) return false;
        return true;
    }
    if ($p[0] === 'relasi' || $p[0] === 'kard') {
        foreach ($relasi as $r) {
            $a = $cari($r['dari'] ?? null); $b = $cari($r['ke'] ?? null);
            if (!$a || !$b || ($p[0] === 'kard' && ($r['kardinalitas'] ?? '') !== ($p[3] ?? ''))) continue;
            if ((cocokErd($a['nama'], $p[1]) && cocokErd($b['nama'], $p[2])) || (cocokErd($a['nama'], $p[2]) && cocokErd($b['nama'], $p[1]))) return true;
        }
        return false;
    }
    if ($p[0] === 'fk') {
        foreach ($entitas as $e) if (cocokErd($e['nama'] ?? '', $p[1])) foreach ($e['atribut'] ?? [] as $a) {
            $induk = $cari($a['fk'] ?? null);
            if ($induk && cocokErd($induk['nama'], $p[2])) return true;
        }
        return false;
    }
    if ($p[0] === 'atribut') {
        foreach ($entitas as $e) if (cocokErd($e['nama'] ?? '', $p[1])) foreach ($e['atribut'] ?? [] as $a) if (cocokErd($a['nama'] ?? '', $p[2])) return true;
        return false;
    }
    throw new RuntimeException('Aturan ERD server belum dikenali: ' . $id);
}
function nilaiModul(array $modul, array $jawaban): array {
    if (count($jawaban) !== count($modul['soal'])) balas(['pesan' => 'Jawab seluruh soal modul.'], 422);
    $catatan = []; $poin = $modul['poinPerSoal']; $benar = 0; $sebagian = 0;
    foreach ($modul['soal'] as $i => $s) {
        $j = $jawaban[$i] ?? null;
        if (!is_array($j)) balas(['pesan' => 'Jawaban modul tidak lengkap.'], 422);
        if ($s['jenis'] === 'pilihan') {
            $pilihan = $j['pilihan'] ?? null;
            if (!is_int($pilihan) || !isset($s['pilihan'][$pilihan])) balas(['pesan' => 'Pilihan modul tidak valid.'], 422);
            $c = ['poin' => $pilihan === $s['benar'] ? $poin : 0, 'pilihan' => $pilihan];
        } else {
            $erd = $j['erd'] ?? [];
            if (!is_array($erd) || count($erd['entitas'] ?? []) > 40 || count($erd['relasi'] ?? []) > 100) balas(['pesan' => 'Rancangan ERD tidak valid.'], 422);
            $syarat = array_map(fn($a) => ['teks' => $a['teks'], 'ok' => aturanErd($a['id'], $erd)], $s['aturan']);
            $lolos = count(array_filter($syarat, fn($a) => $a['ok']));
            $c = ['poin' => count($syarat) ? (int) round($poin * $lolos / count($syarat)) : 0, 'syarat' => $syarat];
        }
        if ($c['poin'] >= $poin) $benar++;
        elseif ($c['poin'] > 0) $sebagian++;
        $catatan[] = $c;
    }
    $total = count($catatan);
    return ['nilai' => round(array_sum(array_column($catatan, 'poin')) * 100 / ($total * $poin), 2), 'benar' => $benar, 'sebagian' => $sebagian, 'salah' => $total - $benar - $sebagian, 'total' => $total, 'catatan' => $catatan];
}
function hasilSql(PDO $db, string $query): array {
    $q = $db->query($query);
    $kolom = [];
    for ($i = 0; $i < $q->columnCount(); $i++) $kolom[] = $q->getColumnMeta($i)['name'];
    $baris = $q->fetchAll(PDO::FETCH_NUM);
    return $baris ? [['columns' => $kolom, 'values' => $baris]] : [];
}
function periksaSqlServer(string $teks, array $kasus, string $referensi): array {
    $query = rtrim(trim($teks), ';');
    if (strlen($query) > 5000 || !preg_match('/^(select|with)\s/i', $query) || preg_match('/;|--|\/\*|\blimit\b|\brecursive\b/i', $query)) return ['benar' => false, 'pesan' => 'Gunakan satu SELECT atau WITH…SELECT tanpa komentar, LIMIT, atau rekursi.'];
    if (!in_array('sqlite', PDO::getAvailableDrivers(), true)) throw new RuntimeException('Aktifkan pdo_sqlite pada PHP untuk pemeriksaan praktik.');
    $contoh = null;
    foreach ($kasus['datasets'] as $data) {
        $db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $db->exec('PRAGMA foreign_keys = ON');
        $db->exec($data['skema']);
        foreach ($data['tabel'] as $t) {
            $q = $db->prepare('INSERT INTO ' . $t['nama'] . ' VALUES (' . implode(',', array_fill(0, count($t['kolom']), '?')) . ')');
            foreach ($t['baris'] as $baris) $q->execute($baris);
        }
        $db->exec('PRAGMA query_only = ON');
        try { $aktual = hasilSql($db, $query); }
        catch (PDOException) { return ['benar' => false, 'pesan' => 'Sintaks atau kolom kueri belum valid.'] + ($contoh !== null ? ['tabel' => $contoh] : []); }
        $contoh ??= $aktual;
        $harapan = hasilSql($db, $referensi);
        $normal = function($rs) {
            return array_map(fn($t) => ['columns' => array_map('strtolower', $t['columns']), 'values' => array_map(fn($r) => array_map(fn($v) => is_numeric($v) ? (float) $v : $v, $r), $t['values'])], $rs);
        };
        if ($normal($aktual) !== $normal($harapan)) return ['benar' => false, 'pesan' => 'Hasil, kolom, filter, atau urutan belum sesuai pada data uji.', 'tabel' => $contoh];
    }
    return ['benar' => true, 'pesan' => 'Kueri sesuai pada data contoh dan data uji tambahan.', 'tabel' => $contoh];
}
function nilaiLevel(array $kasus, array $jawaban, array $snapshot): array {
    if (count($jawaban) !== count($kasus['soal'])) balas(['pesan' => 'Jawab seluruh soal level.'], 422);
    $catatan = []; $salinan = $kasus; unset($salinan['datasets']);
    foreach ($kasus['soal'] as $i => $s) {
        $j = $jawaban[$s['id']] ?? null;
        if (!is_array($j)) balas(['pesan' => 'Jawaban level tidak lengkap.'], 422);
        if ($s['jenis'] === 'pilihan') {
            $urutan = $snapshot['soal'][$i]['pilihan'] ?? [];
            $a = $urutan; $b = $s['pilihan']; sort($a); sort($b);
            $pilihan = $j['pilihan'] ?? null;
            if ($a !== $b || !is_int($pilihan) || !isset($urutan[$pilihan])) balas(['pesan' => 'Susunan pilihan tidak cocok dengan bank soal.'], 422);
            $salinan['soal'][$i]['pilihan'] = $urutan;
            $salinan['soal'][$i]['benar'] = array_search($s['pilihan'][$s['benar']], $urutan, true);
            $c = ['benar' => $urutan[$pilihan] === $s['pilihan'][$s['benar']], 'pilihan' => $pilihan];
        } else {
            $teks = $j['teks'] ?? null;
            if (!is_string($teks) || strlen($teks) > 5000) balas(['pesan' => 'Isi jawaban praktik tidak valid.'], 422);
            if (isset($s['query'])) $c = periksaSqlServer($teks, $kasus, $s['query']);
            else {
                $normal = fn($v) => preg_replace('/\s+/', '', rtrim(strtolower(str_replace('`', '', trim($v))), ';'));
                $c = ['benar' => in_array($normal($teks), array_map($normal, $s['jawaban']), true)];
            }
            $c['teks'] = $teks;
        }
        $catatan[$s['id']] = $c;
    }
    $benar = count(array_filter($catatan, fn($j) => $j['benar'])); $total = count($catatan);
    return ['nilai' => round($benar * 100 / $total, 2), 'benar' => $benar, 'total' => $total, 'catatan' => $catatan, 'snapshot' => $salinan];
}
