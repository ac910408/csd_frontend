/**
 * Servicio de perfil de usuario y ficha médica.
 */
import { api } from './api'

export const profileService = {
  // ── Perfil ──────────────────────────────────────────────
  getPerfil() {
    return api.get('/perfil')
  },

  /**
   * Crear o actualizar perfil.
   * nombre y apellido_paterno son requeridos.
   * @param {{ nombre: string, apellido_paterno: string, apellido_materno?: string, fecha_nacimiento?: number, lugar_nacimiento?: string, cum?: string, genero?: string, id_grupo?: number, id_religion?: number, id_seccion_actual?: number, calle?: string, num_exterior?: string, id_colonia?: number }} data
   */
  savePerfil(data) {
    return api.put('/perfil', data)
  },

  // ── Salud ───────────────────────────────────────────────
  getSalud() {
    return api.get('/perfil/salud')
  },

  saveSalud(data) {
    return api.put('/perfil/salud', data)
  },

  /** Derecho al olvido: borra toda la ficha médica */
  deleteSalud() {
    return api.del('/perfil/salud')
  },

  // ── Alergias ────────────────────────────────────────────
  getAlergias() {
    return api.get('/perfil/salud/alergias')
  },

  addAlergia({ id_alergeno, severidad }) {
    return api.post('/perfil/salud/alergias', { id_alergeno, severidad })
  },

  // ── Antecedentes ────────────────────────────────────────
  getAntecedentes() {
    return api.get('/perfil/salud/antecedentes')
  },

  addAntecedente({ id_antecedente, presenta }) {
    return api.post('/perfil/salud/antecedentes', { id_antecedente, presenta })
  },

  // ── Vacunas ─────────────────────────────────────────────
  getVacunas() {
    return api.get('/perfil/salud/vacunas')
  },

  addVacuna({ id_vacuna, aplico }) {
    return api.post('/perfil/salud/vacunas', { id_vacuna, aplico })
  },

  // ── Contactos de emergencia ─────────────────────────────
  getContactos() {
    return api.get('/perfil/salud/contactos')
  },

  addContacto({ contacto, vinculo }) {
    return api.post('/perfil/salud/contactos', { contacto, vinculo })
  },

  // ── Afiliaciones ────────────────────────────────────────
  getAfiliaciones() {
    return api.get('/perfil/salud/afiliaciones')
  },

  addAfiliacion({ proveedor_id, numero_poliza, id_tipo_beneficiario }) {
    return api.post('/perfil/salud/afiliaciones', {
      proveedor_id,
      numero_poliza,
      id_tipo_beneficiario,
    })
  },
}
