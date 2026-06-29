/**
 * Composable para cascada de color entre componentes.
 * Padre proporciona color vía prop, hijos heredan vía inject.
 */
import { provide, inject, computed } from 'vue'

const COLOR_KEY = Symbol('csd-color')

const COLOR_VARIANTS = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
  'neutral',
  // Colores de identidad (válidos como bg/text en componentes)
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
 * Proporciona un color hacia abajo en el árbol de componentes.
 * @param {import('vue').Ref<string>|string} color
 */
export function provideColor(color) {
  provide(COLOR_KEY, color)
}

/**
 * Obtiene el color heredado del padre, o un fallback.
 * @param {string} [fallback='primary']
 * @returns {import('vue').ComputedRef<string>}
 */
export function injectColor(fallback = 'primary') {
  const parentColor = inject(COLOR_KEY, null)
  return computed(() => parentColor?.value ?? parentColor ?? fallback)
}

export { COLOR_VARIANTS }
