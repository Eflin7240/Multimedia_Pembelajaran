import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Masuk from './pages/Masuk'
import DaftarModul from './pages/DaftarModul'
import ModulHub from './pages/ModulHub'
import Materi from './pages/Materi'
import Simulasi from './pages/Simulasi'
import Kuis from './pages/Kuis'
import RekapHasilPage from './RekapHasilPage'
import Challenge from './pages/Challenge'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/masuk" element={<Masuk />} />

        <Route path="/modul" element={<DaftarModul />} />
        <Route path="/modul/:id" element={<ModulHub />} />
        <Route path="/modul/:id/materi" element={<Materi />} />

        <Route path="/simulasi" element={<Simulasi />} />
        <Route path="/simulasi/:id" element={<Simulasi />} />

        <Route path="/kuis" element={<Kuis />} />
        <Route path="/challenge/:id" element={<Challenge />} />

        <Route path="/rekap" element={<RekapHasilPage />} />
      </Route>
    </Routes>
  )
}