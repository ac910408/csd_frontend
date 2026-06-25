/**
 * Navegación del sidebar dinámica según rol activo.
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

/**
 * Items de navegación con visibilidad condicionada por rol.
 * @returns {import('vue').ComputedRef<Array>}
 */
export function useNavigation() {
  const auth = useAuthStore()

  const items = computed(() => {
    const rol = auth.rolActivo
    const all = []

    // Dashboard — todos
    all.push({
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
      visible: () => true,
    })

    // Perfil — todos autenticados
    all.push({
      label: 'Mi Perfil',
      to: '/perfil',
      icon: User,
      visible: () => true,
      children: [
        { label: 'Datos personales', to: '/perfil' },
        { label: 'Salud / Ficha Médica', to: '/perfil/salud' },
      ],
    })

    // Progresión — scout
    all.push({
      label: 'Mi Progresión',
      to: '/progresion',
      icon: Mountain,
      visible: () => auth.hasRole(ROLES.SCOUT),
      children: [{ label: 'Acciones personales', to: '/progresion/acciones' }],
    })

    // Organización — admin, dirigente_provincia, dirigente
    all.push({
      label: 'Organización',
      to: '/provincias',
      icon: Building2,
      visible: () => auth.hasAnyRole([ROLES.ADMIN, ROLES.DIRIGENTE_PROVINCIA, ROLES.DIRIGENTE]),
      children: [
        { label: 'Provincias', to: '/provincias' },
        { label: 'Grupos', to: '/grupos' },
        { label: 'Secciones', to: '/secciones' },
      ],
    })

    // Operación — admin, scouter
    all.push({
      label: 'Operación',
      to: '/secciones',
      icon: Calendar,
      visible: () => auth.hasAnyRole([ROLES.ADMIN, ROLES.SCOUTER]),
      children: [
        { label: 'Ciclos', to: '/secciones' },
        { label: 'Programas', to: '/secciones' },
        { label: 'Actas de Consejo', to: '/secciones' },
        { label: 'Protocolos', to: '/secciones' },
      ],
    })

    // Finanzas — admin, dirigente, scouter
    all.push({
      label: 'Finanzas',
      to: '/transacciones',
      icon: DollarSign,
      visible: () => auth.hasAnyRole([ROLES.ADMIN, ROLES.DIRIGENTE, ROLES.SCOUTER]),
      children: [
        { label: 'Transacciones', to: '/transacciones' },
        { label: 'Inventario', to: '/secciones' },
      ],
    })

    // Admin — solo admin
    all.push({
      label: 'Admin',
      to: '/admin/usuarios',
      icon: Users,
      visible: () => auth.hasRole(ROLES.ADMIN),
      children: [
        { label: 'Usuarios y roles', to: '/admin/usuarios' },
        { label: 'Sugerencias', to: '/admin/sugerencias' },
      ],
    })

    // Reportes — scouter, dirigente
    all.push({
      label: 'Reportes',
      to: '/reportes/mensual',
      icon: BarChart3,
      visible: () => auth.hasAnyRole([ROLES.SCOUTER, ROLES.DIRIGENTE]),
      children: [
        { label: 'Mensual planeado vs real', to: '/reportes/mensual' },
        { label: 'Mensual completo', to: '/reportes/mensual-completo' },
      ],
    })

    return all.filter((item) => item.visible())
  })

  return { items }
}
