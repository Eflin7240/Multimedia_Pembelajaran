import { useSyncExternalStore } from 'react'
import { langgananDataBelajar, lihatDataBelajar } from './dataBelajar'
export function useDataBelajar() { return useSyncExternalStore(langgananDataBelajar, lihatDataBelajar, lihatDataBelajar) }
