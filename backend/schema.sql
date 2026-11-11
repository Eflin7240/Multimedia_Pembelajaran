-- Struktur awal untuk DATABASE BARU DAN KOSONG.
-- Buat/pilih Multimedia_Pembelajaran di phpMyAdmin, lalu Import file ini.
-- Tidak berisi akun, password, hasil latihan, CREATE USER, GRANT, atau DROP.
-- Untuk database lama gunakan migrasi yang sesuai, bukan schema awal ini.

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    nis VARCHAR(30) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('siswa', 'admin') NOT NULL DEFAULT 'siswa',
    wajib_ganti_password TINYINT(1) NOT NULL DEFAULT 0,
    session_version INT UNSIGNED NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_nis (nis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progres_modul (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    modul_id VARCHAR(10) NOT NULL,
    materi_selesai TINYINT(1) NOT NULL DEFAULT 0,
    simulasi_selesai TINYINT(1) NOT NULL DEFAULT 0,
    kuis_selesai TINYINT(1) NOT NULL DEFAULT 0,
    skor_terbaik DECIMAL(5,2) NULL,
    detail_kuis JSON NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_progres_user_modul (user_id, modul_id),
    CONSTRAINT fk_progres_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hasil_tantangan (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    level ENUM('easy', 'medium', 'hard') NOT NULL,
    kasus_id VARCHAR(50) NOT NULL,
    snapshot_kasus JSON NOT NULL,
    jawaban JSON NOT NULL,
    nilai DECIMAL(5,2) NOT NULL,
    durasi_detik INT UNSIGNED NOT NULL DEFAULT 0,
    attempt_id VARCHAR(64) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_hasil_user_attempt (user_id, attempt_id),
    CONSTRAINT fk_hasil_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit tidak menggunakan FK agar catatan tindakan tetap ada bila akun kelak dihapus.
CREATE TABLE IF NOT EXISTS admin_audit (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    target_nis VARCHAR(30) NOT NULL,
    aksi VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_audit_admin (admin_id),
    KEY idx_audit_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
