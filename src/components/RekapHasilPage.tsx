import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Download, ArrowLeft, BarChart3, FileText } from 'lucide-react';

export const RekapHasilPage: React.FC = () => {
  const [dataHasil] = useState({
    namaSiswa: 'Elsa Wulandari Tambunan',
    kelas: 'XI PPLG / Fase F',
    modulJudul: 'Modul 04: Perancangan Relasi Entitas & DDL/SQL',
    nilaiTotal: 83,
    kkm: 75,
    statusLulus: 'LULUS / KOMPETEN',
    jumlahBenar: 17,
    jumlahSalah: 3,
    totalSoal: 20,
    waktuPengerjaan: '18 Menit 42 Detik',
    tanggalUjian: '05 November 2026',
    analisisInstruktur: 'Pemahaman konsep ERD dan query dasar sangat baik. Perlu latihan tambahan pada materi Normalisasi 3NF dan integritas referensial foreign key untuk mencapai nilai sempurna.',
  });

  const handleUnduhPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
          </a>
          <span className="text-xs text-slate-500 font-mono">ID Sesi: #BD-2026-089</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#1E293B] text-white px-6 py-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 mb-2">
                <FileText className="w-3.5 h-3.5 mr-1" /> FORM REKAP HASIL KUIS KELOMPOK 1
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Hasil Evaluasi Kuis Studi Kasus</h1>
              <p className="text-slate-300 text-sm mt-1">Rekapitulasi pencapaian kompetensi dan analisis performa database siswa.</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Siswa Pengguna</p>
              <p className="text-sm font-semibold text-white">{dataHasil.namaSiswa}</p>
              <p className="text-xs text-slate-300">{dataHasil.kelas}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center flex flex-col items-center justify-center relative">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-[#16A34A]/10 text-[#16A34A] mb-4">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> {dataHasil.statusLulus}
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{dataHasil.modulJudul}</p>
              
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-blue-600 bg-white shadow-inner my-2">
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-[#1E293B]">{dataHasil.nilaiTotal}</span>
                  <span className="block text-xs font-medium text-slate-400">dari 100 POIN</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3">
                Ambang Batas Kelulusan (KKM): <span className="font-semibold text-slate-800">{dataHasil.kkm}.00 Poin</span> 
                <span className="text-[#16A34A] font-medium ml-1">(Memenuhi Standar Kompetensi)</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 text-[#16A34A] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Jumlah Benar</p>
                  <p className="text-lg font-bold text-slate-800">{dataHasil.jumlahBenar} <span className="text-xs font-normal text-slate-500">dari {dataHasil.totalSoal} Soal</span></p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Jumlah Salah</p>
                  <p className="text-lg font-bold text-slate-800">{dataHasil.jumlahSalah} <span className="text-xs font-normal text-slate-500">dari {dataHasil.totalSoal} Soal</span></p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Waktu Pengerjaan</p>
                  <p className="text-sm font-bold text-slate-800">{dataHasil.waktuPengerjaan}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#1E293B] flex items-center mb-2">
                <BarChart3 className="w-4 h-4 mr-2 text-[#2563EB]" /> Catatan Instruktur / Analisis Sistem
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{dataHasil.analisisInstruktur}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-slate-500">
                <p>Tanggal Ujian: <span className="font-medium text-slate-700">{dataHasil.tanggalUjian}</span></p>
                <p>Status Berkas: <span className="font-medium text-slate-700">Tersimpan di Server Lokal SQLite/MySQLi</span></p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a href="/" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 text-center transition">
                  Kembali ke Beranda
                </a>
                <button onClick={handleUnduhPDF} className="flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition">
                  <Download className="w-4 h-4 mr-2" /> Unduh Laporan Skor (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RekapHasilPage;