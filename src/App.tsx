import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Placeholder from './pages/Placeholder'
import Beranda from './pages/Beranda'
import Masuk from './pages/Masuk'
import DaftarModul from './pages/DaftarModul'
import ModulHub from './pages/ModulHub'
import Materi from './pages/Materi'
import Kuis from './pages/Kuis'

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
        <Route path="/simulasi/:id" element={<Placeholder judul="Simulasi Lab" />} />

        <Route path="/kuis" element={<Kuis />} />
        <Route path="/kuis/:id" element={<Kuis />} />

        <Route path="/rekap" element={<Placeholder judul="Rekap Hasil" />} />
      </Route>
    </Routes>
  )
}