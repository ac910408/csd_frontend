/**
 * Servicio de finanzas: transacciones e inventario.
 */
import { api } from './api'

export const financeService = {
  // ── Transacciones ───────────────────────────────────────
  getTransacciones(seccionId) {
    return api.get(`/transacciones?seccion_id=${seccionId}`)
  },

  createTransaccion({ id_seccion, monto, tipo, concepto, id_registrado_por }) {
    return api.post('/transacciones', {
      id_seccion,
      monto,
      tipo,
      concepto,
      id_registrado_por,
    })
  },

  // ── Inventario ──────────────────────────────────────────
  getInventario(seccionId) {
    return api.get(`/secciones/${seccionId}/inventario`)
  },

  createItemInventario(seccionId, { nombre, cantidad, estado_fisico }) {
    return api.post(`/secciones/${seccionId}/inventario`, {
      nombre,
      cantidad,
      estado_fisico,
    })
  },
}
