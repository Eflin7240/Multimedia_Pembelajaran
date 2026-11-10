import { useParams } from 'react-router-dom'
import MateriDefault from '../modul/MateriDefault'
import { layoutMateri } from '../modul'

export default function Materi() {
  const { id = '' } = useParams()
  return layoutMateri[id] ?? <MateriDefault key={id} />
}