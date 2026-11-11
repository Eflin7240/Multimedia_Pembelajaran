import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const out = join(root, '.bank-build')
const files = ['lib/erd.ts', 'data/levelTantangan.ts', 'data/challenge/index.ts', ...[1,2,3,4,5].map(i => `data/challenge/modul-0${i}.ts`)]
for (const rel of files) {
  const tujuan = join(out, rel.replace(/\.ts$/, '.mjs'))
  await mkdir(dirname(tujuan), { recursive: true })
  const raw = await readFile(join(root, 'src', rel), 'utf8')
  let code = ts.transpileModule(raw, { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext } }).outputText
  code = code.replace(/from (['"])(\.[^'"]+)\1/g, (_, q, p) => `from ${q}${p}.mjs${q}`)
  await writeFile(tujuan, code)
}
const { daftarChallenge } = await import(pathToFileURL(join(out, 'data/challenge/index.mjs')))
const { bankLevel, datasetKasus } = await import(pathToFileURL(join(out, 'data/levelTantangan.mjs')))
const level = Object.fromEntries(Object.values(bankLevel).flat().map(k => [k.id, { ...k, datasets: [datasetKasus(k, 0), datasetKasus(k, 1)] }]))
await writeFile(join(root, 'backend/bank-belajar.json'), JSON.stringify({ versi: 1, modul: daftarChallenge, level }, null, 2))
const aturan = Object.values(daftarChallenge).flatMap(c => c.soal.flatMap(s => s.aturan?.map(a => a.id) ?? []))
console.log('Bank PHP diperbarui: 5 modul + 9 kasus level. Aturan ERD:', [...new Set(aturan)].join(', '))
