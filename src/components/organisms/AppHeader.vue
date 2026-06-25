<template>
  <header class="sticky top-0 z-40 h-16 border-b border-base-200 bg-base-100/80 backdrop-blur-md">
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <!-- Izquierda: sidebar toggle + logo -->
      <div class="flex items-center gap-3">
        <BaseButton
          variant="ghost"
          size="sm"
          color="neutral"
          class="lg:hidden"
          @click="$emit('toggleSidebar')"
          aria-label="Menú"
        >
          <Menu class="w-5 h-5" />
        </BaseButton>

        <div class="flex items-center gap-2">
          <img v-if="logo" :src="logo" alt="CSD" class="h-8 w-auto" />
          <span class="font-bold text-base-content text-lg hidden sm:block"> CSD </span>
        </div>
      </div>

      <!-- Centro: breadcrumbs -->
      <nav
        v-if="breadcrumbs?.length"
        class="hidden md:flex items-center gap-1 text-sm text-neutral"
      >
        <template v-for="(crumb, i) in breadcrumbs" :key="i">
          <ChevronRight v-if="i > 0" class="w-4 h-4" />
          <component
            :is="crumb.to ? 'a' : 'span'"
            :href="crumb.to"
            :class="
              i === breadcrumbs.length - 1
                ? 'text-base-content font-medium'
                : 'hover:text-base-content transition-colors'
            "
          >
            {{ crumb.label }}
          </component>
        </template>
      </nav>

      <!-- Derecha: acciones -->
      <div class="flex items-center gap-2">
        <!-- Toggle tema -->
        <BaseButton
          variant="ghost"
          size="sm"
          color="neutral"
          @click="toggleTheme"
          aria-label="Cambiar tema"
        >
          <Sun v-if="theme.theme.value === 'dark'" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </BaseButton>

        <!-- Avatar + dropdown -->
        <div class="relative">
          <button
            class="flex items-center gap-2 p-1 rounded-lg hover:bg-base-200 transition-colors"
            @click="showMenu = !showMenu"
          >
            <BaseAvatar :name="auth.usuario?.nombre_usuario || '?'" size="sm" color="primary" />
            <span class="hidden sm:block text-sm font-medium text-base-content">
              {{ auth.usuario?.nombre_usuario || 'Usuario' }}
            </span>
            <ChevronDown class="w-4 h-4 text-neutral" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-56 bg-base-100 border border-base-200 rounded-lg shadow-lg py-1 z-50"
            @click="showMenu = false"
          >
            <div class="px-4 py-2 border-b border-base-200">
              <p class="text-sm font-medium text-base-content">
                {{ auth.usuario?.nombre_usuario }}
              </p>
              <p class="text-xs text-neutral">{{ auth.rolActivo }}</p>
            </div>

            <!-- Selector de rol (múltiples roles) -->
            <div v-if="auth.rolesDisponibles.length > 1" class="px-4 py-2 border-b border-base-200">
              <p class="text-xs text-neutral mb-1">Rol activo:</p>
              <select
                :value="auth.rolActivo"
                class="w-full text-sm bg-base-100 border border-base-300 rounded px-2 py-1"
                @change="auth.seleccionarRol($event.target.value)"
              >
                <option v-for="r in auth.rolesDisponibles" :key="r.rol" :value="r.rol">
                  {{ r.rol }} {{ r.grupoNombre ? `— ${r.grupoNombre}` : '' }}
                </option>
              </select>
            </div>

            <button
              class="w-full text-left px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
              @click="router.push('/perfil')"
            >
              <User class="w-4 h-4 inline mr-2" />
              Mi Perfil
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-error hover:bg-base-200 transition-colors"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4 inline mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div v-if="showMenu" class="fixed inset-0 z-40" @click="showMenu = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, ChevronDown, ChevronRight, Sun, Moon, User, LogOut } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from '@/composables/useTheme'

defineProps({
  logo: { type: String, default: '' },
  breadcrumbs: {
    type: Array,
    default: () => [],
    // [{ label: string, to?: string }]
  },
})

defineEmits(['toggleSidebar'])

const router = useRouter()
const auth = useAuthStore()
const theme = useTheme()
const showMenu = ref(false)

function handleLogout() {
  auth.logout()
  router.push('/auth/login')
}

function toggleTheme() {
  theme.setTheme(theme.theme.value === 'dark' ? 'light' : 'dark')
}
</script>
