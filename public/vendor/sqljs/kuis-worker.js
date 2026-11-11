const lingkup = globalThis;
function kutip(nama) {
    return '"' + nama.replaceAll('"', '""') + '"';
}
function kunciBaris(baris) {
    return JSON.stringify(baris.map((nilai) => nilai instanceof Uint8Array ? [...nilai] : nilai));
}
function samaHasil(a, b, urut) {
    if (a.length !== b.length)
        return false;
    return a.every((hasil, i) => {
        const lain = b[i];
        if (hasil.columns.length !== lain.columns.length)
            return false;
        const barisA = hasil.values.map(kunciBaris);
        const barisB = lain.values.map(kunciBaris);
        if (!urut) {
            barisA.sort();
            barisB.sort();
        }
        return JSON.stringify(barisA) === JSON.stringify(barisB);
    });
}
function keadaan(db) {
    const daftar = db.exec("SELECT name, type FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY name;")[0]?.values ?? [];
    return daftar.map(([nama, tipe]) => {
        const tabel = String(nama);
        const kolom = db.exec('PRAGMA table_info(' + kutip(tabel) + ');')[0]?.values ?? [];
        const fk = db.exec('PRAGMA foreign_key_list(' + kutip(tabel) + ');')[0]?.values ?? [];
        return {
            nama, tipe,
            // Urutan deklarasi FK boleh berbeda. Nama kolom dan target tetap dibandingkan.
            kolom: kolom.map((baris) => [String(baris[1]).toLowerCase(), String(baris[2]).toUpperCase(), baris[3], baris[4], baris[5]]),
            fk: fk.map((baris) => JSON.stringify(baris.slice(2).map((v) => typeof v === 'string' ? v.toLowerCase() : v))).sort(),
            baris: (db.exec('SELECT * FROM ' + kutip(tabel))[0]?.values ?? []).map(kunciBaris).sort(),
        };
    });
}
function buatDb(mesin, tabel, skema, persiapan = '') {
    const db = new mesin.Database();
    try {
        db.run('PRAGMA foreign_keys=ON;');
        db.run(skema);
        for (const data of tabel) {
            const sql = 'INSERT INTO ' + kutip(data.nama) + ' VALUES (' + data.kolom.map(() => '?').join(',') + ');';
            for (const baris of data.baris)
                db.run(sql, baris);
        }
        if (persiapan)
            db.run(persiapan);
        return db;
    }
    catch (error) {
        db.close();
        throw error;
    }
}
function variasiData(tabel) {
    return tabel.map((data) => ({
        ...data,
        baris: data.baris.map((baris, indeks) => {
            if (data.nama === 'Buku') {
                return [baris[0], baris[1], baris[2], Number(baris[3]) + (indeks + 1) * 17000, Number(baris[4]) + 2];
            }
            if (data.nama === 'Anggota')
                return [baris[0], baris[1], indeks < 3 ? 'XI RPL 1' : 'XI RPL 2'];
            return [...baris];
        }),
    }));
}
async function jalankan({ soal, tabel, sql, vendor, skema }) {
    if (!sql.trim())
        return { sql, benar: false, hasil: [], pesan: 'Tulis SQL terlebih dahulu.' };
    if (sql.length > 12000)
        return { sql, benar: false, hasil: [], pesan: 'Kueri terlalu panjang untuk latihan ini.' };
    lingkup.importScripts(vendor + 'sql-wasm.js');
    const mesin = await lingkup.initSqlJs({ locateFile: (file) => vendor + file });
    let tampilan = [];
    let sesuai = true;
    for (const [indeks, data] of [tabel, variasiData(tabel)].entries()) {
        const aktual = buatDb(mesin, data, skema, soal.persiapan);
        const acuan = buatDb(mesin, data, skema, soal.persiapan);
        try {
            const awal = keadaan(aktual);
            const jawaban = aktual.exec(sql);
            const target = acuan.exec(soal.solusi);
            const stateAktual = keadaan(aktual);
            const stateAcuan = keadaan(acuan);
            sesuai = sesuai && JSON.stringify(stateAktual) === JSON.stringify(stateAcuan);
            if (soal.mode === 'baca') {
                // Alias bebas, urutan kolom mengikuti soal. Hanya soal pengurutan memeriksa urutan baris.
                sesuai = sesuai && samaHasil(jawaban, target, soal.id === 'm8');
            }
            if (indeks === 0) {
                tampilan = jawaban.length ? jawaban : stateAktual
                    .filter((item) => item.tipe === 'table' && JSON.stringify(item) !== JSON.stringify(awal.find((lama) => lama.nama === item.nama)))
                    .map((item) => ({ ...aktual.exec('SELECT * FROM ' + kutip(String(item.nama)))[0], judul: String(item.nama) }))
                    .map((item) => ({ columns: item.columns ?? [], values: item.values ?? [], judul: item.judul }));
                if (!tampilan.length)
                    tampilan = [{ columns: ['Informasi'], values: [['Kueri selesai tanpa perubahan data.']] }];
            }
        }
        finally {
            aktual.close();
            acuan.close();
        }
    }
    return {
        sql, benar: sesuai,
        hasil: tampilan.map((hasil) => ({ ...hasil, values: hasil.values.slice(0, 50) })),
        pesan: 'Kueri berhasil dijalankan. Hasil penilaian tersedia setelah jawaban dikumpulkan.',
    };
}
lingkup.onmessage = async (event) => {
    try {
        lingkup.postMessage(await jalankan(event.data));
    }
    catch (error) {
        lingkup.postMessage({
            sql: event.data.sql, benar: false, hasil: [],
            pesan: error instanceof Error ? error.message : 'SQL gagal dijalankan.',
        });
    }
};
