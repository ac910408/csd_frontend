/**
 * Servicio de progresión juvenil.
 */
import { api } from './api'

export const progresionService = {
  // ── Acciones personales (Hoja de Caminata) ──────────────
  getAcciones() {
    return api.get('/perfil/progresion/acciones')
  },

  createAccion({ id_saber, id_ciclo, descripcion }) {
    return api.post('/perfil/progresion/acciones', {
      id_saber,
      id_ciclo,
      descripcion,
    })
  },

  updateAccion(id, data) {
    return api.put(`/perfil/progresion/acciones/${id}`, data)
  },

  // ── Especialidades ──────────────────────────────────────
  getEspecialidades() {
    return api.get('/perfil/progresion/especialidades')
  },

  createEspecialidad(data) {
    return api.post('/perfil/progresion/especialidades', data)
  },

  // ── Logros: Compromiso (Promesa Scout) ──────────────────
  getCompromiso() {
    return api.get('/perfil/progresion/logros/compromiso')
  },

  saveCompromiso({ obtenido_el, lugar }) {
    return api.put('/perfil/progresion/logros/compromiso', {
      obtenido_el,
      lugar,
    })
  },

  // ── Logros: Insignias finales ───────────────────────────
  getInsigniasFinales() {
    return api.get('/perfil/progresion/logros/insignias-finales')
  },

  createInsigniaFinal({ id_insignia_final, obtenido_el }) {
    return api.post('/perfil/progresion/logros/insignias-finales', {
      id_insignia_final,
      obtenido_el,
    })
  },

  // ── Resumen completo ────────────────────────────────────
  getResumen() {
    return api.get('/perfil/progresion/completa')
  },
}
