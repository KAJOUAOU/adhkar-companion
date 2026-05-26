import type { InvocationItem, NeedTag } from '../../types'
import { INVOCATIONS_PROPHETIC } from './prophetic'
import { INVOCATIONS_QURAN }     from './quran'
import { INVOCATIONS_KHATMA }    from './khatma'

// Single source of truth pour toutes les invocations (Coran + Khatma + Prophétiques)
export const ALL_INVOCATIONS: InvocationItem[] = [
  ...INVOCATIONS_QURAN,
  ...INVOCATIONS_KHATMA,
  ...INVOCATIONS_PROPHETIC,
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getInvocationsByCategory(
  category: 'coran' | 'khatma' | 'prophetic',
): InvocationItem[] {
  return ALL_INVOCATIONS.filter(inv => inv.category === category)
}

export function getInvocationsByTag(tag: NeedTag): InvocationItem[] {
  return ALL_INVOCATIONS.filter(inv => inv.tags.includes(tag))
}

export function getInvocationById(id: string): InvocationItem | undefined {
  return ALL_INVOCATIONS.find(inv => inv.id === id)
}

export { INVOCATIONS_PROPHETIC, INVOCATIONS_QURAN, INVOCATIONS_KHATMA }
