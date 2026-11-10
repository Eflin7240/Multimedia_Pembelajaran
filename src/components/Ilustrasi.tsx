import type { ReactElement } from 'react'

export type NamaIlustrasi =
  | 'database'
  | 'terminal'
  | 'erd'
  | 'normalisasi'
  | 'join'
  | 'sertifikat'
  | 'buku'
  | 'monitor'

function Database() {
  const cakram = (y: number, atas: string, sisi: string) => (
    <g>
      <path d={`M60 ${y} v22 a60 18 0 0 0 120 0 v-22`} fill={sisi} />
      <ellipse cx="120" cy={y} rx="60" ry="18" fill={atas} />
    </g>
  )
  return (
    <>
      <ellipse cx="120" cy="126" rx="72" ry="8" fill="#1e3a8a" opacity="0.12" />
      {cakram(86, '#93c5fd', '#3b82f6')}
      {cakram(58, '#60a5fa', '#2563eb')}
      {cakram(30, '#dbeafe', '#1d4ed8')}
      <circle cx="120" cy="30" r="4" fill="#2563eb" />
    </>
  )
}

function Terminal() {
  return (
    <>
      <rect x="20" y="22" width="130" height="86" rx="10" fill="#0f172a" />
      <circle cx="34" cy="36" r="4" fill="#ef4444" />
      <circle cx="48" cy="36" r="4" fill="#facc15" />
      <circle cx="62" cy="36" r="4" fill="#22c55e" />
      <path d="M34 62l12 8-12 8" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="74" width="40" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="34" y="92" width="70" height="5" rx="2.5" fill="#475569" />
      <path d="M150 65h16" stroke="#2563eb" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
      {[28, 56, 84].map((y) => (
        <g key={y}>
          <rect x="172" y={y} width="52" height="20" rx="6" fill="#fff" stroke="#93c5fd" strokeWidth="2" />
          <rect x="180" y={y + 8} width="26" height="4" rx="2" fill="#2563eb" />
        </g>
      ))}
    </>
  )
}

function Erd() {
  return (
    <>
      <rect x="14" y="46" width="70" height="44" rx="8" fill="#fff" stroke="#2563eb" strokeWidth="3" />
      <rect x="156" y="46" width="70" height="44" rx="8" fill="#fff" stroke="#2563eb" strokeWidth="3" />
      <rect x="26" y="60" width="46" height="5" rx="2.5" fill="#93c5fd" />
      <rect x="26" y="72" width="30" height="5" rx="2.5" fill="#dbeafe" />
      <rect x="168" y="60" width="46" height="5" rx="2.5" fill="#93c5fd" />
      <rect x="168" y="72" width="30" height="5" rx="2.5" fill="#dbeafe" />
      <path d="M120 38L142 68L120 98L98 68Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" strokeLinejoin="round" />
      <path d="M84 68h14M142 68h14" stroke="#2563eb" strokeWidth="3" />
      <text x="87" y="62" fontSize="11" fontWeight="700" fill="#1e3a8a">1</text>
      <text x="146" y="62" fontSize="11" fontWeight="700" fill="#1e3a8a">N</text>
    </>
  )
}

function Normalisasi() {
  return (
    <>
      <rect x="14" y="30" width="70" height="80" rx="8" fill="#fff" stroke="#ef4444" strokeWidth="3" />
      <rect x="17" y="33" width="64" height="16" rx="5" fill="#fecaca" />
      {[58, 72, 86].map((y) => (
        <rect key={y} x="22" y={y} width="54" height="6" rx="3" fill="#e2e8f0" />
      ))}
      <path d="M94 70h30m-8-8l8 8-8 8" stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[24, 78].map((y) => (
        <g key={y}>
          <rect x="136" y={y} width="90" height="40" rx="8" fill="#fff" stroke="#16a34a" strokeWidth="3" />
          <rect x="139" y={y + 3} width="84" height="12" rx="5" fill="#bbf7d0" />
          <rect x="146" y={y + 22} width="60" height="5" rx="2.5" fill="#e2e8f0" />
        </g>
      ))}
    </>
  )
}

function Join() {
  return (
    <>
      <clipPath id="irisan-join">
        <circle cx="98" cy="70" r="46" />
      </clipPath>
      <circle cx="98" cy="70" r="46" fill="#bfdbfe" stroke="#2563eb" strokeWidth="3" />
      <circle cx="142" cy="70" r="46" fill="#bbf7d0" stroke="#16a34a" strokeWidth="3" />
      <circle cx="142" cy="70" r="46" fill="#2563eb" opacity="0.6" clipPath="url(#irisan-join)" />
      <text x="72" y="75" fontSize="13" fontWeight="700" fill="#1e3a8a" textAnchor="middle">A</text>
      <text x="168" y="75" fontSize="13" fontWeight="700" fill="#166534" textAnchor="middle">B</text>
      <text x="120" y="75" fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle">JOIN</text>
    </>
  )
}

function Sertifikat() {
  return (
    <>
      <rect x="24" y="22" width="156" height="96" rx="10" fill="#fff" stroke="#93c5fd" strokeWidth="3" />
      <rect x="40" y="36" width="70" height="8" rx="4" fill="#2563eb" />
      {[58, 76, 94].map((y) => (
        <g key={y}>
          <circle cx="48" cy={y} r="6" fill="#16a34a" />
          <path d={`M45 ${y}l2.5 2.5 4.5-5`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="62" y={y - 3} width="80" height="6" rx="3" fill="#e2e8f0" />
        </g>
      ))}
      <path d="M164 88l-6 22 12-6 6 10 4-24z" fill="#1d4ed8" />
      <circle cx="176" cy="70" r="24" fill="#2563eb" />
      <circle cx="176" cy="70" r="18" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="2" />
      <polygon points="176,58 179.5,66 188,67 181.5,73 183.5,82 176,77.5 168.5,82 170.5,73 164,67 172.5,66" fill="#fde047" />
    </>
  )
}

function Buku() {
  return (
    <>
      <ellipse cx="120" cy="122" rx="80" ry="7" fill="#1e3a8a" opacity="0.12" />
      <path d="M120 40C96 28 60 28 34 36V104C60 96 96 96 120 108Z" fill="#fff" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round" />
      <path d="M120 40C144 28 180 28 206 36V104C180 96 144 96 120 108Z" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round" />
      <path d="M46 52c20-4 42-3 60 4M46 66c20-4 42-3 60 4M46 80c20-4 42-3 60 4" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M134 56c18-7 38-8 60-4M134 70c18-7 38-8 60-4M134 84c18-7 38-8 60-4" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  )
}

function Monitor() {
  return (
    <>
      <rect x="40" y="18" width="160" height="94" rx="10" fill="#1e293b" />
      <rect x="48" y="26" width="144" height="78" rx="5" fill="#dbeafe" />
      <circle cx="120" cy="65" r="20" fill="#2563eb" />
      <path d="M114 55v20l18-10z" fill="#fff" />
      <rect x="108" y="112" width="24" height="10" fill="#475569" />
      <rect x="86" y="122" width="68" height="6" rx="3" fill="#475569" />
    </>
  )
}

const peta: Record<NamaIlustrasi, ReactElement> = {
  database: <Database />,
  terminal: <Terminal />,
  erd: <Erd />,
  normalisasi: <Normalisasi />,
  join: <Join />,
  sertifikat: <Sertifikat />,
  buku: <Buku />,
  monitor: <Monitor />,
}

export default function Ilustrasi({ nama, className = '' }: { nama: NamaIlustrasi; className?: string }) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true" fontFamily="Inter Variable, sans-serif">
      {peta[nama]}
    </svg>
  )
}