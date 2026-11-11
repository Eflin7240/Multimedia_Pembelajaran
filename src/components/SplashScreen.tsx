import { useEffect, useState, type ReactNode } from 'react'
import mainLogo from '../assets/branding/main-logo.webp'
import textLogo from '../assets/branding/text-logo.webp'

const KUNCI_SESI = 'edusmk-splash-seen-v1'
const DURASI_TAMPIL_MS = 1800
const BATAS_TUNGGU_MS = 6000

function perluSplash() {
  try { return sessionStorage.getItem(KUNCI_SESI) !== '1' } catch { return true }
}

// Membungkus App agar splash hanya muncul pada awal sesi, bukan setiap pergantian route.
export default function SplashScreen({ children }: { children: ReactNode }) {
  const [tampil, setTampil] = useState(perluSplash)

  useEffect(() => {
    if (!tampil) return
    let aktif = true
    let selesai = false
    let durasi: ReturnType<typeof window.setTimeout> | undefined
    const logo: HTMLImageElement[] = []
    const overflowAwal = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function lanjut() {
      if (!aktif || selesai) return
      selesai = true
      try { sessionStorage.setItem(KUNCI_SESI, '1') } catch { /* tetap masuk jika penyimpanan ditolak */ }
      setTampil(false)
    }

    // Jangan membuat pengguna terjebak jika gambar gagal dimuat atau jaringan sangat lambat.
    const batas = window.setTimeout(lanjut, BATAS_TUNGGU_MS)
    const siap = [mainLogo, textLogo].map(src => new Promise<void>(resolve => {
      const gambar = new Image()
      logo.push(gambar)
      gambar.onload = () => resolve()
      gambar.onerror = () => resolve()
      gambar.src = src
    }))
    void Promise.all(siap).then(() => {
      if (!aktif || selesai) return
      durasi = window.setTimeout(lanjut, DURASI_TAMPIL_MS)
    })

    return () => {
      aktif = false
      window.clearTimeout(batas)
      if (durasi !== undefined) window.clearTimeout(durasi)
      logo.forEach(gambar => { gambar.onload = null; gambar.onerror = null })
      document.body.style.overflow = overflowAwal
    }
  }, [tampil])

  if (!tampil) return children

  return <main aria-label="Selamat datang di EduSMK" className="grid min-h-svh place-items-center bg-white px-6 py-10 text-center sm:px-8">
    <div className="flex w-full max-w-xl flex-col items-center">
      <img src={mainLogo} width={1536} height={1024} alt="Logo utama EduSMK" fetchPriority="high" decoding="async" className="block h-auto w-60 max-w-full object-contain sm:w-72" />
      <img src={textLogo} width={2172} height={724} alt="EduSMK — Belajar, Berlatih, Berkembang" fetchPriority="high" decoding="async" className="mt-1 block h-auto w-44 max-w-full object-contain sm:w-52" />
      <p className="mt-6 max-w-lg text-[13px] leading-6 text-slate-600 sm:mt-7 sm:text-sm sm:leading-7">Materi dan praktik interaktif Basis Data SMK Kelas XI. Kuasai fondasi relasional, normalisasi data, perancangan ERD, hingga manipulasi query SQL praktis langsung di browser.</p>
    </div>
  </main>
}
