/**
 * Navegación del sidebar dinámica según rol activo.
 * Padres con hijos usan type: 'trigger' sin 'to'.
 */
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { ROLES } from '@/utils/constants'
import {
  LayoutDashboard,
  User,
  Heart,
  Mountain,
  Building2,
  Calendar,
  ClipboardList,
  Shield,
  DollarSign,
  Users,
  Lightbulb,
  BarChart3,
} from '@lucide/vue'

export function useNavigation() {
  const auth = useAuthStore()

  const items = computed(() => {
    const nav = [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
      {
        label: 'Mi Perfil',
        icon: User,
        children: [
          { label: 'Datos personales', to: '/perfil/datos' },
          { label: 'Salud / Ficha Médica', to: '/perfil/salud' },
        ],
      },
    ]

    if (auth.hasRole(ROLES.SCOUT)) {
      nav.push({
        label: 'Mi Progresión',
        icon: Mountain,
        children: [{ label: 'Acciones personales', to: '/progresion/acciones' }],
      })
    }

    if (auth.hasAnyRole([ROLES.ADMIN, ROLES.DIRIGENTE_PROVINCIA, ROLES.DIRIGENTE, ROLES.SCOUTER])) {
      nav.push({
        label: 'Organización',
        icon: Building2,
        children: [
          { label: 'Provincias', to: '/provincias' },
          { label: 'Grupos', to: '/grupos' },
          { label: 'Secciones', to: '/secciones' },
        ],
      })
    }

    if (auth.hasAnyRole([ROLES.ADMIN, ROLES.DIRIGENTE, ROLES.SCOUTER])) {
      nav.push({
        label: 'Finanzas',
        icon: DollarSign,
        children: [{ label: 'Transacciones', to: '/transacciones' }],
      })
    }

    if (auth.hasRole(ROLES.ADMIN)) {
      nav.push({
        label: 'Admin',
        icon: Users,
        children: [
          { label: 'Usuarios y roles', to: '/admin/usuarios' },
          { label: 'Sugerencias', to: '/admin/sugerencias' },
        ],
      })
    }

    if (auth.hasAnyRole([ROLES.SCOUTER, ROLES.DIRIGENTE])) {
      nav.push({
        label: 'Reportes',
        icon: BarChart3,
        children: [
          { label: 'Mensual planeado vs real', to: '/reportes/mensual' },
          { label: 'Mensual completo', to: '/reportes/mensual-completo' },
        ],
      })
    }

    return nav
  })

  return { items }
}
