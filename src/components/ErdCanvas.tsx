import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
  type Connection,
  type DefaultEdgeOptions,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArrowRightLeft, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import {
  ambilErd,
  uid,
  type Atribut,
  type EntitasData,
  type Erd,
  type Kardinalitas,
  type RelasiData,
  type TipeData,
} from '../lib/erd'

/* ============================================================
   Format isi awal kanvas (dipakai di simulasi dan di challenge)
   ============================================================ */

export type EntitasAwal = {
  id: string // dipakai untuk menghubungkan relasi dan FK
  nama: string
  x: number
  y: number
  atribut: { nama: string; tipe?: TipeData; pk?: boolean; fk?: string }[] // fk = id entitas yang dirujuk
}
export type RelasiAwal = { dari: string; ke: string; kardinalitas?: Kardinalitas }
export type ErdAwal = { entitas: EntitasAwal[]; relasi: RelasiAwal[] }

type EntitasNode = Node<EntitasData, 'entitas'>
type RelasiEdge = Edge<RelasiData>

function bangunNode(e: EntitasAwal): EntitasNode {
  return {
    id: e.id,
    type: 'entitas',
    position: { x: e.x, y: e.y },
    data: {
      nama: e.nama,
      atribut: e.atribut.map((a) => ({
        id: uid('a'),
        nama: a.nama,
        tipe: a.tipe ?? 'TEXT',
        pk: a.pk ?? false,
        fk: a.fk ?? null,
      })),
    },
  }
}

function bangunEdge(r: RelasiAwal): RelasiEdge {
  const k = r.kardinalitas ?? '1:N'
  return { id: uid('r'), source: r.dari, target: r.ke, label: k, data: { kardinalitas: k } }
}

/* ============================================================
   Kartu entitas (tampilan satu tabel di kanvas)
   ============================================================ */

type Aksi = {
  ubah: (id: string, patch: Partial<EntitasData>) => void
  hapus: (id: string) => void
  daftar: { id: string; nama: string }[]
}
const AksiErd = createContext<Aksi | null>(null)

const daftarTipe: TipeData[] = ['INTEGER', 'TEXT', 'DATE']
const gayaHandle = { width: 12, height: 12, background: '#2563eb', border: '2px solid white' }
const kelasInput = 'nodrag rounded border border-slate-200 bg-white px-1.5 py-1 text-xs outline-none focus:border-primary'

function EntitasKartu({ id, data }: NodeProps<EntitasNode>) {
  const aksi = useContext(AksiErd)
  if (!aksi) return null
  const { ubah, hapus, daftar } = aksi
  const lain = daftar.filter((d) => d.id !== id)

  const ubahAtribut = (aid: string, patch: Partial<Atribut>) =>
    ubah(id, { atribut: data.atribut.map((a) => (a.id === aid ? { ...a, ...patch } : a)) })

  const tambahAtribut = () =>
    ubah(id, {
      atribut: [...data.atribut, { id: uid('a'), nama: 'atribut_baru', tipe: 'TEXT', pk: false, fk: null }],
    })

  return (
    <div className="w-[380px] rounded-xl border-2 border-slate-300 bg-white shadow-md">
      <Handle id="atas" type="source" position={Position.Top} style={gayaHandle} />
      <Handle id="kanan" type="source" position={Position.Right} style={gayaHandle} />
      <Handle id="bawah" type="source" position={Position.Bottom} style={gayaHandle} />
      <Handle id="kiri" type="source" position={Position.Left} style={gayaHandle} />

      <div className="flex items-center gap-2 rounded-t-[10px] bg-primary px-3 py-2">
        <input
          value={data.nama}
          onChange={(e) => ubah(id, { nama: e.target.value })}
          placeholder="nama_tabel"
          aria-label="Nama entitas"
          className="nodrag min-w-0 flex-1 bg-transparent font-mono text-sm font-bold text-white outline-none placeholder:text-white/60"
        />
        <button
          type="button"
          onClick={() => hapus(id)}
          aria-label="Hapus entitas"
          className="nodrag text-white/80 hover:text-white"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-1.5 p-2">
        {data.atribut.map((a) => (
          <div key={a.id} className="flex items-center gap-1">
            <button
              type="button"
              title="Primary Key"
              onClick={() => ubahAtribut(a.id, { pk: !a.pk })}
              className={`nodrag w-8 shrink-0 rounded py-1 text-[10px] font-bold ${
                a.pk ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              PK
            </button>
            <input
              value={a.nama}
              onChange={(e) => ubahAtribut(a.id, { nama: e.target.value })}
              aria-label="Nama atribut"
              className={`${kelasInput} min-w-0 flex-1 font-mono`}
            />
            <select
              value={a.tipe}
              onChange={(e) => ubahAtribut(a.id, { tipe: e.target.value as TipeData })}
              aria-label="Tipe data"
              className={kelasInput}
            >
              {daftarTipe.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={a.fk ?? ''}
              onChange={(e) => ubahAtribut(a.id, { fk: e.target.value || null })}
              aria-label="Foreign Key"
              className={`${kelasInput} w-24 ${a.fk ? 'font-semibold text-success' : 'text-slate-400'}`}
            >
              <option value="">FK: -</option>
              {lain.map((l) => (
                <option key={l.id} value={l.id}>
                  FK → {l.nama || '(tanpa nama)'}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Hapus atribut"
              onClick={() => ubah(id, { atribut: data.atribut.filter((x) => x.id !== a.id) })}
              className="nodrag text-slate-400 hover:text-danger"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={tambahAtribut}
          className="nodrag flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 py-1 text-xs font-semibold text-slate-500 hover:border-primary hover:text-primary"
        >
          <Plus size={12} /> Atribut
        </button>
      </div>
    </div>
  )
}

const nodeTypes = { entitas: EntitasKartu }

const opsiEdge: DefaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#2563eb' },
  labelStyle: { fontWeight: 700, fill: '#1e293b' },
  labelBgPadding: [6, 3],
  labelBgBorderRadius: 6,
}

/* ============================================================
   Komponen utama
   ============================================================ */

type Props = {
  awal?: ErdAwal
  // Dipanggil setiap ERD berubah. Berikan fungsi yang stabil (misalnya setState).
  onChange?: (erd: Erd) => void
  tinggi?: number
}

export default function ErdCanvas({ awal, onChange, tinggi = 560 }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<EntitasNode>((awal?.entitas ?? []).map(bangunNode))
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelasiEdge>((awal?.relasi ?? []).map(bangunEdge))

  useEffect(() => {
    onChange?.(ambilErd(nodes, edges))
  }, [nodes, edges, onChange])

  const ubah = useCallback(
    (id: string, patch: Partial<EntitasData>) => {
      setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)))
    },
    [setNodes],
  )

  const hapus = useCallback(
    (id: string) => {
      setNodes((ns) =>
        ns
          .filter((n) => n.id !== id)
          .map((n) => ({
            ...n,
            data: { ...n.data, atribut: n.data.atribut.map((a) => (a.fk === id ? { ...a, fk: null } : a)) },
          })),
      )
      setEdges((es) => es.filter((e) => e.source !== id && e.target !== id))
    },
    [setNodes, setEdges],
  )

  const aksi = useMemo<Aksi>(
    () => ({ ubah, hapus, daftar: nodes.map((n) => ({ id: n.id, nama: n.data.nama })) }),
    [ubah, hapus, nodes],
  )

  const tambahEntitas = () => {
    setNodes((ns) => [
      ...ns,
      {
        id: uid('e'),
        type: 'entitas',
        position: { x: 40 + (ns.length % 3) * 60, y: 40 + (ns.length % 4) * 50 },
        data: {
          nama: `tabel_${ns.length + 1}`,
          atribut: [{ id: uid('a'), nama: 'id', tipe: 'INTEGER', pk: true, fk: null }],
        },
      },
    ])
  }

  const reset = () => {
    setNodes((awal?.entitas ?? []).map(bangunNode))
    setEdges((awal?.relasi ?? []).map(bangunEdge))
  }

  const onConnect = useCallback(
    (c: Connection) => {
      if (c.source === c.target) return
      setEdges((es) => {
        const sudahAda = es.some(
          (e) =>
            (e.source === c.source && e.target === c.target) || (e.source === c.target && e.target === c.source),
        )
        if (sudahAda) return es
        return [
          ...es,
          {
            id: uid('r'),
            source: c.source,
            target: c.target,
            sourceHandle: c.sourceHandle,
            targetHandle: c.targetHandle,
            label: '1:N',
            data: { kardinalitas: '1:N' },
          },
        ]
      })
    },
    [setEdges],
  )

  const ubahKardinalitas = (id: string, k: Kardinalitas) =>
    setEdges((es) => es.map((e) => (e.id === id ? { ...e, label: k, data: { kardinalitas: k } } : e)))

  const tukarArah = (id: string) =>
    setEdges((es) =>
      es.map((e) =>
        e.id === id
          ? { ...e, source: e.target, target: e.source, sourceHandle: e.targetHandle, targetHandle: e.sourceHandle }
          : e,
      ),
    )

  const hapusRelasi = (id: string) => setEdges((es) => es.filter((e) => e.id !== id))

  const namaNode = (id: string) => nodes.find((n) => n.id === id)?.data.nama || '?'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={tambahEntitas}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={14} /> Tambah Entitas
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <RotateCcw size={14} /> Reset Kanvas
        </button>
        <span className="text-xs text-slate-500">
          Seret tabel untuk memindahkan. Tarik titik biru di tepi tabel ke tabel lain untuk membuat relasi.
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ height: tinggi }}>
        <AksiErd.Provider value={aksi}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            deleteKeyCode={null}
            defaultEdgeOptions={opsiEdge}
            minZoom={0.3}
            fitView
          >
            <Background gap={20} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </AksiErd.Provider>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold">Daftar Relasi</h3>
        <p className="mt-1 text-xs text-slate-500">
          Sisi kiri adalah tabel induk (sisi 1), sisi kanan adalah tabel anak (sisi N). Gunakan tombol tukar jika
          arahnya terbalik.
        </p>

        {edges.length === 0 ? (
          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada relasi di kanvas.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {edges.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                <span className="font-mono font-semibold">{namaNode(e.source)}</span>
                <span className="text-slate-400">→</span>
                <span className="font-mono font-semibold">{namaNode(e.target)}</span>
                <select
                  value={e.data?.kardinalitas ?? '1:N'}
                  onChange={(ev) => ubahKardinalitas(e.id, ev.target.value as Kardinalitas)}
                  aria-label="Kardinalitas"
                  className="ml-auto rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                >
                  <option value="1:1">1 : 1</option>
                  <option value="1:N">1 : N</option>
                  <option value="N:M">N : M</option>
                </select>
                <button
                  type="button"
                  title="Tukar arah"
                  onClick={() => tukarArah(e.id)}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 hover:bg-slate-100"
                >
                  <ArrowRightLeft size={14} />
                </button>
                <button
                  type="button"
                  title="Hapus relasi"
                  onClick={() => hapusRelasi(e.id)}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-danger hover:bg-red-50"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}