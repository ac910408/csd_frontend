import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth.store'
import { setSessionExpiredHandler } from '@/services/api'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Configurar redirect de sesión expirada (en vez de window.location)
setSessionExpiredHandler(() => {
  router.push('/auth/login')
})

// Rutas públicas (sin auth requerida)
const PUBLIC_PATHS = ['/auth/login', '/auth/register']

// Mapeo de rutas → roles requeridos
const ROLE_MAP = [
  { path: '/admin', roles: ['admin'] },
  { path: '/provincias', roles: ['admin', 'dirigente_provincia'] },
  { path: '/grupos', roles: ['admin', 'dirigente'] },
  { path: '/transacciones', roles: ['admin', 'dirigente', 'scouter'] },
  { path: '/reportes', roles: ['scouter', 'dirigente'] },
  { path: '/secciones', roles: ['admin', 'dirigente', 'scouter'] },
  { path: '/progresion', roles: ['scout'] },
]

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Rutas públicas: acceso libre
  if (PUBLIC_PATHS.includes(to.path)) {
    return true
  }

  // Si no hay sesión, redirect a login
  if (!auth.isLoggedIn) {
    return '/auth/login'
  }

  // Verificar roles específicos de ruta
  for (const rule of ROLE_MAP) {
    if (to.path.startsWith(rule.path)) {
      if (!auth.hasAnyRole(rule.roles)) {
        return '/'
      }
      break
    }
  }

  return true
})
