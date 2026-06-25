/**
 * Servicios de catálogos, sugerencias y admin.
 */
import { api } from './api'

export const catalogService = {
  /**
   * Obtener items de un catálogo por nombre.
   * @param {string} nombre — ej: 'roles', 'cargos', 'alergenos'
   * @returns {Promise<{ data: Array }>}
   */
  getCatalogo(nombre) {
    return api.get(`/catalogos/${nombre}`)
  },
}

export const sugerenciasService = {
  /** Enviar sugerencia de nuevo item para un catálogo */
  create({ tabla, nombre, datos_extra }) {
    return api.post('/sugerencias', { tabla, nombre, datos_extra })
  },

  /** Sugerencias del usuario autenticado */
  getMias() {
    return api.get('/sugerencias')
  },
}

export const adminService = {
  // ── Sugerencias ─────────────────────────────────────────
  getSugerenciasPendientes() {
    return api.get('/admin/sugerencias')
  },

  resolverSugerencia(id, { accion, id_existente, motivo_rechazo }) {
    return api.post(`/admin/sugerencias/${id}/resolver`, {
      accion,
      id_existente,
      motivo_rechazo,
    })
  },

  // ── Invitaciones ────────────────────────────────────────
  getInvitaciones() {
    return api.get('/admin/invitaciones')
  },

  createInvitacion({ correo_electronico, id_grupo }) {
    return api.post('/admin/invitaciones', { correo_electronico, id_grupo })
  },

  // ── Usuarios ────────────────────────────────────────────
  getRolesUsuario(usuarioId) {
    return api.get(`/usuarios/${usuarioId}/roles`)
  },

  asignarRol(usuarioId, { id_rol, id_grupo }) {
    return api.post(`/usuarios/${usuarioId}/roles`, { id_rol, id_grupo })
  },
}

export const reportesService = {
  getMensual({ seccion_id, anio, mes }) {
    return api.get(`/reportes/mensual?seccion_id=${seccion_id}&anio=${anio}&mes=${mes}`)
  },

  getMensualCompleto({ seccion_id, anio, mes }) {
    return api.get(`/reportes/mensual-completo?seccion_id=${seccion_id}&anio=${anio}&mes=${mes}`)
  },
}
