/**
 * Store de autenticación JWT.
 * Maneja token, usuario, roles y rol activo.
 * roles es un array de strings: ["admin", "scouter"], NO objetos.
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('csd-token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('csd-usuario') || 'null'))
  const roles = ref(JSON.parse(localStorage.getItem('csd-roles') || '[]'))
  const rolActivo = ref(localStorage.getItem('csd-rol-activo') || null)
  const sessionChecked = ref(false)

  // ── Getters ──────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value)

  const rolesDisponibles = computed(() =>
    roles.value.map((nombreRol) => ({
      rol: nombreRol,
    })),
  )

  function hasRole(rol) {
    return roles.value.includes(rol)
  }

  function hasAnyRole(requiredRoles) {
    return requiredRoles.some((r) => hasRole(r))
  }

  // ── Acciones ─────────────────────────────────────────────
  function setToken(t) {
    token.value = t
    if (t) {
      localStorage.setItem('csd-token', t)
    } else {
      localStorage.removeItem('csd-token')
    }
  }

  function setRoles(r) {
    roles.value = r
    localStorage.setItem('csd-roles', JSON.stringify(r))
  }

  function setRolActivo(rol) {
    rolActivo.value = rol
    localStorage.setItem('csd-rol-activo', rol)
  }

  async function login(creds) {
    const res = await authService.login(creds)
    setToken(res.data.token)
    usuario.value = res.data.usuario
    localStorage.setItem('csd-usuario', JSON.stringify(res.data.usuario))
    setRoles(res.data.roles || [])

    // Si solo tiene un rol, seleccionarlo automáticamente
    if (roles.value.length === 1) {
      setRolActivo(roles.value[0])
    } else if (roles.value.length > 1) {
      // Múltiples roles: preferir admin, luego el primero
      if (roles.value.includes('admin')) {
        setRolActivo('admin')
      } else {
        setRolActivo(roles.value[0])
      }
    }

    return res
  }

  async function register(data) {
    return authService.register(data)
  }

  function seleccionarRol(rol) {
    if (roles.value.includes(rol)) {
      setRolActivo(rol)
    }
  }

  function logout() {
    setToken(null)
    usuario.value = null
    setRoles([])
    rolActivo.value = null
    sessionChecked.value = false
    localStorage.removeItem('csd-rol-activo')
    localStorage.removeItem('csd-usuario')
  }

  /** Verifica que el token actual sea válido contra el backend */
  async function checkSession() {
    if (!token.value) {
      sessionChecked.value = true
      return false
    }
    try {
      // GET /perfil solo para validar que el token sigue activo
      // 404 = token válido pero perfil no creado aún (no es error de sesión)
      await api.get('/perfil')
      sessionChecked.value = true
      return true
    } catch (e) {
      // Solo logout si es error de autenticación (401)
      if (e?.codigo === 'SESSION_EXPIRED') {
        logout()
        sessionChecked.value = true
        return false
      }
      // 404, 500, etc: token válido, sesión ok
      sessionChecked.value = true
      return true
    }
  }

  return {
    token,
    usuario,
    roles,
    rolActivo,
    isLoggedIn,
    rolesDisponibles,
    login,
    register,
    logout,
    seleccionarRol,
    hasRole,
    hasAnyRole,
    sessionChecked,
    checkSession,
  }
})
