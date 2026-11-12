// Penilai soal praktik terminal MySQL (Modul 2).
// Perintah siswa dijalankan oleh simulator kecil, lalu keadaan akhirnya dicocokkan dengan aturan soal.
// Setiap eksekusi dimulai dari keadaan awal soal, jadi hasilnya selalu sama untuk perintah yang sama.

export type AturanCli =
  | { tipe: 'login'; teks: string }
  | { tipe: 'show'; teks: string }
  | { tipe: 'dbAda'; nama: string; teks: string }
  | { tipe: 'dbTidakAda'; nama: string; teks: string }
  | { tipe: 'dbAktif'; nama: string; teks: string }

export type KonfigCli = {
  sudahLogin?: boolean // true: terminal langsung berada di prompt mysql>
  database?: string[] // database buatan yang sudah ada saat soal dimulai
  aturan: AturanCli[]
}

export type StatusCli = {
  login: boolean
  pernahLogin: boolean
  dbs: string[]
  aktif: string | null
  pernahShow: boolean
}

export const DB_SISTEM = ['information_schema', 'mysql', 'performance_schema', 'sys']

function tabelDatabase(dbs: string[]): string {
  const urut = [...dbs].sort()
  const lebar = Math.max('Database'.length, ...urut.map((d) => d.length))
  const garis = `+${'-'.repeat(lebar + 2)}+`
  return [
    garis,
    `| ${'Database'.padEnd(lebar)} |`,
    garis,
    ...urut.map((d) => `| ${d.padEnd(lebar)} |`),
    garis,
    `${urut.length} rows in set (0.00 sec)`,
  ].join('\n')
}

// Sebelum login, terminal masih berupa shell biasa.
function perintahShell(baris: string, status: StatusCli): string[] {
  const login = baris.match(/^mysql\s+-u\s*(\S+)(?:\s+-p)?$/i)
  if (login) {
    if (login[1] === 'root') {
      status.login = true
      status.pernahLogin = true
      return ['Enter password: ********', 'Welcome to the MySQL monitor.  Commands end with ; or \\g.', 'Server version: 8.0.30 MySQL Community Server - GPL', '']
    }
    return [`ERROR 1045 (28000): Access denied for user '${login[1]}'@'localhost' (using password: YES)`]
  }
  if (/^mysql$/i.test(baris)) return ["ERROR 1045 (28000): Access denied for user 'ODBC'@'localhost' (using password: NO)"]
  return [`bash: ${baris.split(/\s+/)[0]}: command not found`]
}

function eksekusi(pernyataan: string, status: StatusCli): string[] {
  const s = pernyataan.replace(/\s+/g, ' ').trim()
  if (!s) return ['ERROR: No query specified']

  if (/^show databases$/i.test(s)) {
    status.pernahShow = true
    return [tabelDatabase(status.dbs)]
  }

  const buat = s.match(/^create database (if not exists )?(\w+)$/i)
  if (buat) {
    const nama = buat[2]
    if (status.dbs.includes(nama)) {
      return buat[1]
        ? ['Query OK, 0 rows affected, 1 warning (0.00 sec)']
        : [`ERROR 1007 (HY000): Can't create database '${nama}'; database exists`]
    }
    status.dbs.push(nama)
    return ['Query OK, 1 row affected (0.01 sec)']
  }

  const pakai = s.match(/^use (\w+)$/i)
  if (pakai) {
    if (!status.dbs.includes(pakai[1])) return [`ERROR 1049 (42000): Unknown database '${pakai[1]}'`]
    status.aktif = pakai[1]
    return ['Database changed']
  }

  const hapus = s.match(/^drop database (if exists )?(\w+)$/i)
  if (hapus) {
    const nama = hapus[2]
    if (!status.dbs.includes(nama)) {
      return hapus[1]
        ? ['Query OK, 0 rows affected, 1 warning (0.00 sec)']
        : [`ERROR 1008 (HY000): Can't drop database '${nama}'; database doesn't exist`]
    }
    status.dbs = status.dbs.filter((d) => d !== nama)
    if (status.aktif === nama) status.aktif = null
    return ['Query OK, 0 rows affected (0.02 sec)']
  }

  // MySQL menunjuk bagian yang tidak dikenali. Contohnya perintah lanjutan yang tersambung karena titik koma terlupa.
  const lanjutan = s.match(/^(?:create database (?:if not exists )?\w+|use \w+|drop database (?:if exists )?\w+|show databases) (.+)$/i)
  const dekat = lanjutan ? lanjutan[1] : s.split(' ')[0]
  return [
    `ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '${dekat}' at line 1`,
  ]
}

export function jalankanCli(konfig: Pick<KonfigCli, 'sudahLogin' | 'database'>, teks: string) {
  const status: StatusCli = {
    login: !!konfig.sudahLogin,
    pernahLogin: !!konfig.sudahLogin,
    dbs: [...DB_SISTEM, ...(konfig.database ?? [])],
    aktif: null,
    pernahShow: false,
  }
  const keluar: string[] = []
  let sisa = '' // pernyataan yang belum diakhiri titik koma

  for (const mentah of teks.replace(/\r/g, '').split('\n')) {
    const baris = mentah.trim()
    if (!baris && !sisa) continue

    if (!status.login) {
      keluar.push(`$ ${baris}`, ...perintahShell(baris, status))
      continue
    }

    keluar.push(`${sisa ? '    -> ' : 'mysql> '}${baris}`)
    if (!sisa && /^(exit|quit)$/i.test(baris)) {
      status.login = false
      status.aktif = null
      keluar.push('Bye')
      continue
    }

    sisa = sisa ? `${sisa} ${baris}` : baris
    let i: number
    while ((i = sisa.indexOf(';')) !== -1) {
      const pernyataan = sisa.slice(0, i)
      sisa = sisa.slice(i + 1).trim()
      keluar.push(...eksekusi(pernyataan, status))
    }
  }

  // Perintah tanpa titik koma membuat MySQL menunggu lanjutan.
  if (sisa) keluar.push('    -> ')
  return { transkrip: keluar.join('\n'), status }
}

export function periksaCli(konfig: KonfigCli, teks: string) {
  const { transkrip, status } = jalankanCli(konfig, teks)
  const syarat = konfig.aturan.map((a) => {
    let ok = false
    if (a.tipe === 'login') ok = status.pernahLogin
    else if (a.tipe === 'show') ok = status.pernahShow
    else if (a.tipe === 'dbAda') ok = status.dbs.includes(a.nama)
    else if (a.tipe === 'dbTidakAda') ok = !status.dbs.includes(a.nama)
    else if (a.tipe === 'dbAktif') ok = status.aktif === a.nama
    return { teks: a.teks, ok }
  })
  return { transkrip, syarat }
}
