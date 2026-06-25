/**
 * Composable de autenticación.
 * Acceso reactivo al auth store + helpers para guards.
 */
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  function requireAuth() {
    if (!store.isLoggedIn) {
      router.push('/auth/login')
      return false
    }
    return true
  }

  function requireRole(requiredRoles) {
    if (!store.isLoggedIn) {
      router.push('/auth/login')
      return false
    }
    if (!store.hasAnyRole(requiredRoles)) {
      router.push('/')
      return false
    }
    return true
  }

  return {
    store,
    requireAuth,
    requireRole,
  }
}
