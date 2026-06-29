/**
 * Servicio de operación: ciclos, programas, actas, protocolos, asistencia.
 */
import { api } from './api'

export const operationService = {
  // ── Ciclos ──────────────────────────────────────────────
  getCiclos(seccionId) {
    return api.get(`/secciones/${seccionId}/ciclos`)
  },

  createCiclo(seccionId, { id_responsable, nombre, id_categoria_desarrollo }) {
    return api.post(`/secciones/${seccionId}/ciclos`, {
      id_responsable,
      nombre,
      id_categoria_desarrollo,
    })
  },

  // ── Programas ───────────────────────────────────────────
  getProgramas(cicloId) {
    return api.get(`/ciclos/${cicloId}/programas`)
  },

  createPrograma(cicloId, { id_seccion, id_responsable, tipo, nombre }) {
    return api.post(`/ciclos/${cicloId}/programas`, {
      id_seccion,
      id_responsable,
      tipo,
      nombre,
    })
  },

  // ── Asistencia ──────────────────────────────────────────
  registrarAsistencia(programaId, data) {
    return api.post(`/programas/${programaId}/asistencia`, data)
  },

  // ── Miembros de sección ────────────────────────────────
  getMiembros(seccionId) {
    return api.get(`/secciones/${seccionId}/miembros`)
  },

  // ── Enlaces ─────────────────────────────────────────────
  createEnlace(seccionId, data) {
    return api.post(`/secciones/${seccionId}/enlaces`, data)
  },

  cerrarEnlace(enlaceId) {
    return api.put(`/enlaces/${enlaceId}/cerrar`)
  },

  // ── Estado de programa ──────────────────────────────────
  cancelarPrograma(programaId, motivo) {
    return api.put(`/programas/${programaId}/estado`, { estado: 'cancelado', motivo })
  },

  reprogramarPrograma(programaId, data) {
    return api.put(`/programas/${programaId}/estado`, { estado: 'reprogramado', ...data })
  },

  getCambiosPrograma(programaId) {
    return api.get(`/programas/${programaId}/cambios`)
  },

  darBaja(perfilId, { tipo, motivo }) {
    return api.post(`/perfil/${perfilId}/baja`, { tipo, motivo })
  },

  // ── Actas ───────────────────────────────────────────────
  getActas(seccionId) {
    return api.get(`/secciones/${seccionId}/actas`)
  },

  createActa(seccionId, { tipo_acta, orden_del_dia, acuerdos, id_preside, id_elabora }) {
    return api.post(`/secciones/${seccionId}/actas`, {
      tipo_acta,
      orden_del_dia,
      acuerdos,
      id_preside,
      id_elabora,
    })
  },

  registrarAsistenciaActa(actaId, { id_perfil, presente }) {
    return api.post(`/actas/${actaId}/asistencia`, { id_perfil, presente })
  },

  // ── Seguridad ───────────────────────────────────────────
  getSeguridadPrograma(programaId) {
    return api.get(`/programas/${programaId}/seguridad`)
  },

  saveSeguridadPrograma(programaId, data) {
    return api.put(`/programas/${programaId}/seguridad`, data)
  },

  getSeguridadGrupo(grupoId) {
    return api.get(`/grupos/${grupoId}/seguridad`)
  },

  saveSeguridadGrupo(grupoId, data) {
    return api.put(`/grupos/${grupoId}/seguridad`, data)
  },

  // ── Traslado ────────────────────────────────────────────
  getTraslado(programaId) {
    return api.get(`/programas/${programaId}/traslado`)
  },

  saveTraslado(programaId, data) {
    return api.put(`/programas/${programaId}/traslado`, data)
  },

  getPasajeros(trasladoId) {
    return api.get(`/traslados/${trasladoId}/pasajeros`)
  },

  addPasajero(trasladoId, { id_perfil, seccion, cum }) {
    return api.post(`/traslados/${trasladoId}/pasajeros`, {
      id_perfil,
      seccion,
      cum,
    })
  },
}
