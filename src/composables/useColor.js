/**
 * Cascada de color entre componentes.
 * Padre proporciona color vía prop, hijos heredan vía inject.
 */
import { provide, inject, computed } from 'vue'

const COLOR_KEY = Symbol('csd-color')

const COLOR_VARIANTS = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
  'neutral',
  'mundial',
  'clan',
  'comunidad',
  'grupo',
  'manada',
  'nacional',
  'scouters',
  'tropa',
]

/**
 * El mapa de colores de identidad → semántico (Tailwind).
 * Los colores de identidad se mapean a su equivalente semántico para clases CSS.
 */
const IDENTITY_TO_BASE = {
  mundial: 'mundial',
  clan: 'clan',
  comunidad: 'comunidad',
  grupo: 'grupo',
  manada: 'manada',
  nacional: 'nacional',
  scouters: 'scouters',
  tropa: 'tropa',
}

export function provideColor(color) {
  provide(COLOR_KEY, color)
}

export function injectColor(fallback = 'primary') {
  const parentColor = inject(COLOR_KEY, null)
  return computed(() => parentColor?.value ?? parentColor ?? fallback)
}

/** Retorna el valor base del color (identidad o semántico) */
export function resolveColor(color) {
  return IDENTITY_TO_BASE[color] || color || 'primary'
}

export { COLOR_VARIANTS }
