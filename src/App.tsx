import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Placeholder from './pages/Placeholder'
import Beranda from './pages/Beranda'
import Masuk from './pages/Masuk'
import DaftarModul from './pages/DaftarModul'
import ModulHub from './pages/ModulHub'
import Materi from './pages/Materi'
import Simulasi from './pages/Simulasi'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/masuk" element={<Masuk />} />

        <Route path="/modul" element={<DaftarModul />} />
        <Route path="/modul/:id" element={<ModulHub />} />
        <Route path="/modul/:id/materi" element={<Materi />} />

        <Route path="/simulasi" element={<Placeholder judul="Simulasi Lab" />} />
        <Route path="/simulasi/:id" element={<Simulasi />} />

        <Route path="/kuis" element={<Placeholder judul="Kuis Studi Kasus" />} />
        <Route path="/kuis/:id" element={<Placeholder judul="Challenge Modul" />} />

        <Route path="/rekap" element={<Placeholder judul="Rekap Hasil" />} />
      </Route>
    </Routes>
  )
}