-- Pilih database multimedia_pembelajaran_simulasi di phpMyAdmin sebelum menjalankan.
-- Tidak membuat akun admin otomatis; semua akun lama tetap siswa secara default.
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('siswa', 'admin') NOT NULL DEFAULT 'siswa';
ALTER TABLE users ADD COLUMN IF NOT EXISTS wajib_ganti_password TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_version INT UNSIGNED NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS admin_audit (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    target_nis VARCHAR(30) NOT NULL,
    aksi VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_admin (admin_id),
    INDEX idx_audit_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
