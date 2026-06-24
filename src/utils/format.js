/**
 * Utilidades de formateo para CSD.
 */

/**
 * Formatea un timestamp Unix (ms) a fecha legible en español.
 * @param {number} ts — Unix timestamp en milisegundos
 * @param {Object} [opts]
 * @param {boolean} [opts.corta] — true = formato corto dd/mm/aaaa
 * @returns {string}
 */
export function formatDate(ts, { corta = false } = {}) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (isNaN(d.getTime())) return '—'

  if (corta) {
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formatea fecha y hora.
 * @param {number} ts
 * @returns {string}
 */
export function formatDateTime(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (isNaN(d.getTime())) return '—'

  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea monto en pesos mexicanos.
 * @param {number} monto
 * @returns {string}
 */
export function formatCurrency(monto) {
  if (monto == null) return '—'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto)
}

/**
 * Formatea una CUM (Clave Única de Membresía).
 * Inserta guiones para legibilidad: ASO1234567 → ASO-1234567
 * @param {string} cum
 * @returns {string}
 */
export function formatCUM(cum) {
  if (!cum) return '—'
  const m = cum.match(/^([A-Z]{3})(\d{7})$/)
  return m ? `${m[1]}-${m[2]}` : cum
}

/**
 * Capitaliza primera letra de cada palabra.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
