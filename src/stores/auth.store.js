/**
 * Store de autenticación JWT.
 * Maneja token, usuario, roles y rol activo.
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('csd-token') || null)
  const usuario = ref(null)
  const roles = ref([])
  const rolActivo = ref(localStorage.getItem('csd-rol-activo') || null)
  const sessionChecked = ref(false)

  // ── Getters ──────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value)

  const rolesDisponibles = computed(() =>
    roles.value.map((r) => ({
      rol: r.rol_nombre,
      grupoId: r.id_grupo,
      grupoNombre: r.grupo_nombre,
    })),
  )

  function hasRole(rol) {
    return roles.value.some((r) => r.rol_nombre === rol)
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

  function setRolActivo(rol) {
    rolActivo.value = rol
    localStorage.setItem('csd-rol-activo', rol)
  }

  async function login(creds) {
    const res = await authService.login(creds)
    setToken(res.data.token)
    usuario.value = res.data.usuario
    roles.value = res.data.usuario?.roles || []

    // Si solo tiene un rol, seleccionarlo automáticamente
    if (roles.value.length === 1) {
      setRolActivo(roles.value[0].rol_nombre)
    }

    return res
  }

  async function register(data) {
    return authService.register(data)
  }

  function seleccionarRol(rol) {
    if (hasRole(rol)) {
      setRolActivo(rol)
    }
  }

  function logout() {
    setToken(null)
    usuario.value = null
    roles.value = []
    rolActivo.value = null
    sessionChecked.value = false
    localStorage.removeItem('csd-rol-activo')
  }

  /** Verifica que el token actual sea válido contra el backend */
  async function checkSession() {
    if (!token.value) {
      sessionChecked.value = true
      return false
    }
    try {
      const res = await api.get('/perfil')
      usuario.value = res.data?.usuario || res.data
      roles.value = usuario.value?.roles || []
      if (roles.value.length === 1 && !rolActivo.value) {
        setRolActivo(roles.value[0].rol_nombre)
      }
      sessionChecked.value = true
      return true
    } catch {
      logout()
      sessionChecked.value = true
      return false
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
