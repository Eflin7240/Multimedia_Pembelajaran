import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder judul="Beranda" />} />
        <Route path="/modul" element={<Placeholder judul="Daftar Modul" />} />
        <Route path="/simulasi" element={<Placeholder judul="Simulasi Lab" />} />
        <Route path="/kuis" element={<Placeholder judul="Kuis Studi Kasus" />} />
        <Route path="/rekap" element={<Placeholder judul="Rekap Hasil" />} />
      </Route>
    </Routes>
  )
}