/**
 * Servicio de autenticación.
 */
import { api } from './api'

export const authService = {
  /**
   * Iniciar sesión.
   * @param {{ correo_electronico: string, contrasena: string }} creds
   * @returns {Promise<{ data: { token: string, usuario: object } }>}
   */
  login(creds) {
    return api.post('/auth/login', creds)
  },

  /**
   * Registrar nuevo usuario con código de invitación.
   * @param {{ nombre_usuario: string, correo_electronico: string, contrasena: string, codigo_invitacion: string }} data
   * @returns {Promise<{ data: object }>}
   */
  register(data) {
    return api.post('/auth/register', data)
  },
}
