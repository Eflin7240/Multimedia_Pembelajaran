import { useParams } from 'react-router-dom'
import HubDefault from '../modul/HubDefault'
import { layoutHub } from '../modul'

export default function ModulHub() {
  const { id = '' } = useParams()
  return layoutHub[id] ?? <HubDefault key={id} id={id} />
}