<template>
  <div
    :class="[
      'flex h-screen flex-col justify-between border-e border-mundial bg-mundial shrink-0 z-30',
      'transition-[width] duration-300 ease-in-out',
      expanded ? 'w-56' : 'w-16',
    ]"
  >
    <!-- Top -->
    <div>
      <!-- Logo -->
      <div
        class="flex h-16 items-center px-2"
        @mouseenter="logoHovered = true"
        @mouseleave="logoHovered = false"
      >
        <!-- Logo colapsado: ícono Mountain -->
        <div v-if="!expanded" class="inline-flex size-12 items-center justify-center">
          <button
            v-if="logoHovered"
            class="grid size-10 place-content-center rounded-lg bg-white/20 text-white transition-colors"
            @click="expanded = true"
            aria-label="Expandir sidebar"
          >
            <PanelLeftOpen class="size-5" />
          </button>
          <span v-else class="grid size-10 place-content-center rounded-lg bg-white/20 text-white">
            <Mountain class="size-5" />
          </span>
        </div>

        <!-- Logo expandido: ícono + texto + botón contraer -->
        <template v-else>
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <span
              class="grid size-8 place-content-center rounded-lg bg-white/20 text-white shrink-0"
            >
              <Mountain class="size-5" />
            </span>
            <span class="font-bold text-white text-sm truncate">CSD</span>
          </div>
          <button
            class="grid size-8 place-content-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors shrink-0 ml-2"
            @click="expanded = false"
            aria-label="Colapsar sidebar"
          >
            <PanelLeftClose class="size-4" />
          </button>
        </template>
      </div>

      <!-- Nav items -->
      <ul class="space-y-1 border-t border-white/10 px-2 pt-4">
        <template v-for="item in navigation.items.value" :key="item.to">
          <!-- Sin hijos -->
          <li v-if="!item.children">
            <a
              :href="item.to"
              :class="[
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive(item.to)
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                expanded ? '' : 'justify-center',
              ]"
              @click.prevent="navigate(item.to)"
            >
              <component :is="item.icon" class="size-5 shrink-0" />
              <span v-if="expanded" class="text-sm font-medium truncate">{{ item.label }}</span>
              <span
                v-if="!expanded"
                class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded px-2 py-1.5 text-xs font-medium bg-base-200 text-base-content whitespace-nowrap group-hover:visible z-50"
              >
                {{ item.label }}
              </span>
            </a>
          </li>

          <!-- Con hijos -->
          <li
            v-else
            class="relative"
            @mouseenter="hoverSubmenu(item.to)"
            @mouseleave="unhoverSubmenu"
          >
            <button
              :class="[
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 w-full transition-colors',
                isActive(item.to)
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                expanded ? '' : 'justify-center',
              ]"
              @click="expanded ? toggleSubmenu(item) : null"
            >
              <component :is="item.icon" class="size-5 shrink-0" />
              <span v-if="expanded" class="flex-1 text-left text-sm font-medium truncate">{{
                item.label
              }}</span>
              <ChevronDown
                v-if="expanded"
                :class="[
                  'size-4 shrink-0 transition-transform duration-200',
                  openSubmenu === item.to ? 'rotate-180' : '',
                ]"
              />
            </button>

            <!-- Submenú expandido (inline) -->
            <div
              v-if="expanded && openSubmenu === item.to"
              class="ml-6 mt-0.5 space-y-0.5 border-s border-white/20 pl-2"
            >
              <a
                v-for="child in item.children"
                :key="child.to"
                :href="child.to"
                :class="[
                  'block rounded-md px-2 py-1.5 text-sm transition-colors',
                  isActive(child.to)
                    ? 'text-white font-medium bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5',
                ]"
                @click.prevent="navigate(child.to)"
              >
                {{ child.label }}
              </a>
            </div>

            <!-- Submenú compacto (popover en hover) -->
            <div
              v-if="!expanded && hoveredSubmenu === item.to"
              class="absolute start-full top-0 ms-2 bg-base-100 border border-base-200 rounded-lg shadow-lg z-50 animate-fade-in"
              @mouseenter="hoverSubmenu(item.to)"
              @mouseleave="unhoverSubmenu"
            >
              <VerticalMenu :items="item.children" @navigate="navigate" />
            </div>
          </li>
        </template>
      </ul>
    </div>

    <!-- Bottom: perfil -->
    <div class="sticky inset-x-0 bottom-0 border-t border-white/10 bg-mundial p-2">
      <div class="relative">
        <div v-if="showProfileMenu" class="fixed inset-0 z-40" @click="showProfileMenu = false" />
        <button
          :class="[
            'group relative flex items-center gap-3 w-full rounded-lg px-3 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white',
            expanded ? '' : 'justify-center',
          ]"
          @click="showProfileMenu = !showProfileMenu"
        >
          <BaseAvatar :name="auth.usuario?.nombre_usuario || '?'" size="sm" color="mundial" />
          <span v-if="expanded" class="flex-1 text-left text-sm font-medium truncate text-white">
            {{ auth.usuario?.nombre_usuario || 'Usuario' }}
          </span>
          <ChevronDown
            v-if="expanded"
            :class="['size-4 shrink-0', showProfileMenu ? 'rotate-180' : '']"
          />
        </button>

        <!-- Dropdown perfil -->
        <div
          v-if="showProfileMenu"
          class="absolute bottom-full start-0 mb-1 w-52 bg-base-100 border border-base-200 rounded-lg shadow-lg py-1 z-50 animate-fade-in"
        >
          <div class="px-3 py-2 border-b border-base-200">
            <p class="text-sm font-medium text-base-content">
              {{ auth.usuario?.nombre_usuario || 'Usuario' }}
            </p>
          </div>

          <div class="px-3 py-2 border-b border-base-200">
            <p class="text-xs text-base-content/60 mb-1.5">Tema</p>
            <div class="flex gap-1">
              <button
                v-for="t in temas"
                :key="t.value"
                :class="[
                  'flex-1 grid place-content-center p-1.5 rounded-md text-xs transition-colors',
                  theme.theme.value === t.value
                    ? 'bg-primary text-primary-contrast'
                    : 'text-base-content/60 hover:bg-base-200',
                ]"
                :title="t.label"
                @click="theme.setTheme(t.value)"
              >
                <component :is="t.icon" class="size-4" />
              </button>
            </div>
          </div>

          <button
            class="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-2 border-t border-base-200"
            @click="handleLogout"
          >
            <LogOut class="size-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Mountain,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { useNavigation } from '@/composables/useNavigation'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const navigation = useNavigation()
const theme = useTheme()

const expanded = ref(false)
const logoHovered = ref(false)
const openSubmenu = ref(null)
const hoveredSubmenu = ref(null)
let submenuTimer = null

function hoverSubmenu(key) {
  clearTimeout(submenuTimer)
  hoveredSubmenu.value = key
}

function unhoverSubmenu() {
  submenuTimer = setTimeout(() => {
    hoveredSubmenu.value = null
  }, 150)
}

const showProfileMenu = ref(false)

const temas = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

function isActive(to) {
  return route.path === to || route.path.startsWith(to + '/')
}

function toggleSubmenu(item) {
  openSubmenu.value = openSubmenu.value === item.to ? null : item.to
}

function navigate(to) {
  router.push(to)
  openSubmenu.value = null
}

function handleLogout() {
  auth.logout()
  router.push('/auth/login')
}
</script>
