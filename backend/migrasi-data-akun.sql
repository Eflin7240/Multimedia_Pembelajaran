-- Jalankan sekali melalui tab SQL pada database multimedia_pembelajaran_simulasi.
-- MariaDB 10.4 (XAMPP). Tidak menghapus tabel, akun, atau hasil yang sudah ada.
ALTER TABLE progres_modul ADD COLUMN IF NOT EXISTS detail_kuis JSON NULL;
ALTER TABLE hasil_tantangan ADD COLUMN IF NOT EXISTS attempt_id VARCHAR(64) NULL;
ALTER TABLE hasil_tantangan ADD UNIQUE INDEX IF NOT EXISTS uq_hasil_user_attempt (user_id, attempt_id);
