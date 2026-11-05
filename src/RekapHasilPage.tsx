import React, { useState } from 'react';
import { CheckCircle2, XCircle, Download, ArrowLeft, BarChart3, FileText, Star, Award, Layers } from 'lucide-react';

interface ModulHasil {
  id: number;
  kode: string;
  judul: string;
  nilai: number; // Max 100
  kkm: number;   // Minimal 75 (3.0 Bintang)
  jumlahBenar: number;
  jumlahSalah: number;
  totalSoal: number;
  status: 'KOMPETEN' | 'BELUM KOMPETEN';
}

export const RekapHasilPage: React.FC = () => {
  // Data Ketuntasan 5 Modul Basis Data SMK (Sesuai Kartu Pembelajaran)
  const [daftarModul] = useState<ModulHasil[]>([
    {
      id: 1,
      kode: 'MOD-01',
      judul: 'Konsep Dasar Basis Data',
      nilai: 100,
      kkm: 75,
      jumlahBenar: 20,
      jumlahSalah: 0,
      totalSoal: 20,
      status: 'KOMPETEN',
    },
    {
      id: 2,
      kode: 'MOD-02',
      judul: 'Animasi & Tools DBMS',
      nilai: 75,
      kkm: 75,
      jumlahBenar: 15,
      jumlahSalah: 5,
      totalSoal: 20,
      status: 'KOMPETEN',
    },
    {
      id: 3,
      kode: 'MOD-03',
      judul: 'ERD & Relasi Entitas',
      nilai: 100,
      kkm: 75,
      jumlahBenar: 20,
      jumlahSalah: 0,
      totalSoal: 20,
      status: 'KOMPETEN',
    },
    {
      id: 4,
      kode: 'MOD-04',
      judul: 'Normalisasi Data',
      nilai: 83,
      kkm: 75,
      jumlahBenar: 17,
      jumlahSalah: 3,
      totalSoal: 20,
      status: 'KOMPETEN',
    },
    {
      id: 5,
      kode: 'MOD-05',
      judul: 'SQL & Relasi Tabel (JOIN)',
      nilai: 50,
      kkm: 75,
      jumlahBenar: 10,
      jumlahSalah: 10,
      totalSoal: 20,
      status: 'BELUM KOMPETEN',
    },
  ]);

  const [dataSiswa] = useState({
    namaSiswa: 'Elsa Wulandari Tambunan',
    kelas: 'XI PPLG / Fase F',
    tanggalUjian: '05 November 2026',
    idSesi: '#BD-2026-089',
    analisisKeseluruhan: 'Secara keseluruhan telah menguasai 4 dari 5 modul pembelajaran (80% Ketuntasan). Perlu pendalaman lebih lanjut pada MOD-05 (SQL & Relasi Tabel) untuk mencapai kompetensi sempurna.',
  });

  // Perhitungan Akumulasi Keseluruhan 5 Modul
  const totalModul = daftarModul.length; // 5 Modul
  const modulTuntas = daftarModul.filter((m) => m.nilai >= m.kkm).length;
  
  // Perhitungan Total Bintang (1 Modul max 4 Bintang -> Total Max = 20.0 Bintang)
  const totalBintangDiperoleh = daftarModul.reduce((acc, item) => acc + item.nilai / 25, 0);
  const totalBintangMaksimal = totalModul * 4; // 20.0 Bintang

  // Rata-rata Nilai & Rata-rata Bintang (Skala 4)
  const rataRataNilai = daftarModul.reduce((acc, item) => acc + item.nilai, 0) / totalModul;
  const rataRataBintang = rataRataNilai / 25;

  // Total Benar & Salah dari Seluruh Kuis
  const totalBenar = daftarModul.reduce((acc, item) => acc + item.jumlahBenar, 0);
  const totalSalah = daftarModul.reduce((acc, item) => acc + item.jumlahSalah, 0);
  const totalSoalKeseluruhan = daftarModul.reduce((acc, item) => acc + item.totalSoal, 0);

  const statusKeseluruhan = modulTuntas === totalModul ? 'LULUS / SANGAT KOMPETEN' : 'DALAM PROGRES / KETUNTASAN 80%';

  const hitungBintangUtama = (bintang: number) => {
    const utuh = Math.floor(bintang);
    const sisa = bintang - utuh;
    return { utuh, sisa };
  };

  const handleUnduhPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between">
          <a href="/" className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
          </a>
          <span className="text-xs text-slate-500 font-mono">ID Sesi: {dataSiswa.idSesi}</span>
        </div>

        {/* KARTU UTAMA: REKAP PROGRES KESELURUHAN 5 MODUL */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#1E293B] text-white px-6 py-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 mb-2">
                <FileText className="w-3.5 h-3.5 mr-1" /> LAPORAN HASIL AKUMULASI 5 MODUL
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Rekapitulasi Progres Keseluruhan</h1>
              <p className="text-slate-300 text-sm mt-1">Ringkasan total perolehan bintang dan tingkat ketuntasan pembelajaran basis data.</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Siswa Pengguna</p>
              <p className="text-sm font-semibold text-white">{dataSiswa.namaSiswa}</p>
              <p className="text-xs text-slate-300">{dataSiswa.kelas}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Box Utama Skor Total Bintang */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center flex flex-col items-center justify-center">
              <div
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-3 ${
                  modulTuntas === totalModul
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Award className="w-4 h-4 mr-1.5" /> {statusKeseluruhan}
              </div>

              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                PENCAPAIAN 5 MODUL PEMBELAJARAN
              </p>

              {/* Tampilan Visual 4 Bintang Utama */}
              <div className="flex items-center justify-center space-x-2 my-2">
                {[1, 2, 3, 4].map((starIndex) => {
                  const bintangHasil = hitungBintangUtama(rataRataBintang);
                  const isFull = starIndex <= bintangHasil.utuh;
                  const isPartial = starIndex === bintangHasil.utuh + 1 && bintangHasil.sisa > 0;

                  return (
                    <div key={starIndex} className="relative">
                      <Star
                        className={`w-10 h-10 ${
                          isFull ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                      {isPartial && (
                        <div
                          className="absolute top-0 left-0 overflow-hidden"
                          style={{ width: `${bintangHasil.sisa * 100}%` }}
                        >
                          <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Angka Total Bintang Keseluruhan */}
              <div className="text-center mt-1">
                <span className="text-4xl font-extrabold text-[#1E293B]">
                  {totalBintangDiperoleh.toFixed(1)} <span className="text-2xl font-bold text-slate-400">/ {totalBintangMaksimal}.0</span>
                </span>
                <span className="text-xs font-medium text-slate-400 block mt-1">
                  Total Bintang Diperoleh (Rata-rata Nilai: {rataRataNilai.toFixed(1)} Poin)
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3">
                Ketuntasan Modul: <span className="font-semibold text-slate-800">{modulTuntas} dari {totalModul} Modul Tuntas</span>
              </p>
            </div>

            {/* Metric Cards Akumulasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Jawaban Benar</p>
                  <p className="text-lg font-bold text-slate-800">
                    {totalBenar} <span className="text-xs font-normal text-slate-500">dari {totalSoalKeseluruhan} Soal</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Jawaban Salah</p>
                  <p className="text-lg font-bold text-slate-800">
                    {totalSalah} <span className="text-xs font-normal text-slate-500">dari {totalSoalKeseluruhan} Soal</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Modul Kompeten</p>
                  <p className="text-sm font-bold text-slate-800">{modulTuntas} / {totalModul} Modul</p>
                </div>
              </div>
            </div>

            {/* Catatan Evaluasi Keseluruhan */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#1E293B] flex items-center mb-2">
                <BarChart3 className="w-4 h-4 mr-2 text-[#2563EB]" /> Catatan Evaluasi Keseluruhan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{dataSiswa.analisisKeseluruhan}</p>
            </div>
          </div>
        </div>

        {/* KARTU RINCIAN BINTANG PER MODUL (MOD-01 Hingga MOD-05) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <Award className="w-5 h-5 text-amber-500 mr-2" /> Rincian Ketuntasan Per Modul
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Setiap modul memiliki bobot maksimal 4 bintang (1 bintang = 25 poin, KKM = 75 poin / 3.0 bintang).
            </p>
          </div>

          <div className="space-y-3">
            {daftarModul.map((modul) => {
              const bintangUtuh = Math.floor(modul.nilai / 25);
              const sisaBintang = (modul.nilai / 25) - bintangUtuh;

              return (
                <div
                  key={modul.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 font-mono">
                      {modul.kode}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{modul.judul}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Nilai: <span className="font-semibold text-slate-700">{modul.nilai} Poin</span> | Benar: {modul.jumlahBenar}/{modul.totalSoal} Soal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    {/* Visual 4 Bintang Per Modul */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4].map((s) => {
                        const isFull = s <= bintangUtuh;
                        const isPartial = s === bintangUtuh + 1 && sisaBintang > 0;

                        return (
                          <div key={s} className="relative">
                            <Star
                              className={`w-4 h-4 ${
                                isFull ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-200'
                              }`}
                            />
                            {isPartial && (
                              <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${sisaBintang * 100}%` }}
                              >
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <span className="text-xs font-bold text-slate-700 ml-1.5">
                        {(modul.nilai / 25).toFixed(1)} / 4.0
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        modul.status === 'KOMPETEN'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {modul.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-500">
              <p>Tanggal Evaluasi: <span className="font-medium text-slate-700">{dataSiswa.tanggalUjian}</span></p>
              <p>Status Berkas: <span className="font-medium text-slate-700">Tersimpan di Server Lokal</span></p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="/"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 text-center transition"
              >
                Kembali ke Beranda
              </a>
              <button
                onClick={handleUnduhPDF}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition"
              >
                <Download className="w-4 h-4 mr-2" /> Unduh Laporan Skor (PDF)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RekapHasilPage;