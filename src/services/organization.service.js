/**
 * Servicio de organización: provincias, grupos, secciones.
 */
import { api } from './api'

export const organizationService = {
  // ── Provincias ──────────────────────────────────────────
  getProvincias() {
    return api.get('/provincias')
  },

  createProvincia({ nombre, clave, id_estado }) {
    return api.post('/provincias', { nombre, clave, id_estado })
  },

  getProvincia(id) {
    return api.get(`/provincias/${id}`)
  },

  // ── Grupos ──────────────────────────────────────────────
  getGrupos(params) {
    const qs = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return api.get(`/grupos${qs}`)
  },

  createGrupo({ id_provincia, numero, nombre }) {
    return api.post('/grupos', { id_provincia, numero, nombre })
  },

  getGrupo(id) {
    return api.get(`/grupos/${id}`)
  },

  // ── Secciones ───────────────────────────────────────────
  getSecciones(params) {
    const qs = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return api.get(`/secciones${qs}`)
  },

  createSeccion({ id_grupo, id_tipo_seccion, nombre_propio }) {
    return api.post('/secciones', {
      id_grupo,
      id_tipo_seccion,
      nombre_propio,
    })
  },

  getSeccion(id) {
    return api.get(`/secciones/${id}`)
  },
}
