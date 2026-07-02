<template>
  <aside
    class="flex flex-col h-screen border-e border-mundial bg-mundial shrink-0 z-30 overflow-hidden transition-all duration-200"
    :style="{ width: (expanded ? 224 : 64) + 'px' }"
  >
    <!-- Logo / Toggle -->
    <div
      class="flex items-center px-3 border-b border-white/10 cursor-pointer shrink-0"
      style="height: 56px"
      @mouseenter="logoHover = true"
      @mouseleave="logoHover = false"
      @click="expanded = !expanded"
      :title="expanded ? 'Colapsar sidebar' : 'Expandir sidebar'"
    >
      <div
        class="rounded-lg bg-white/20 flex items-center justify-center shrink-0 transition-all"
        :class="expanded ? 'size-7' : 'size-10'"
      >
        <PanelLeftOpen v-if="!expanded && logoHover" class="size-5 text-white" />
        <PanelLeftClose v-else-if="expanded && logoHover" class="size-4 text-white" />
        <Mountain v-else class="text-white" :class="expanded ? 'size-4' : 'size-5'" />
      </div>
      <span v-if="expanded" class="ml-2.5 text-sm font-bold text-white tracking-wide select-none"
        >CSD</span
      >
    </div>

    <!-- Nav -->
    <ul class="flex-1 space-y-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
      <template v-for="(item, idx) in navigation.items.value" :key="item.to ?? item.label">
        <!-- Leaf -->
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
              class="invisible absolute inset-s-full top-1/2 ms-4 -translate-y-1/2 rounded bg-base-contrast px-2 py-1.5 text-xs font-medium text-base-100 whitespace-nowrap group-hover:visible z-50"
            >
              {{ item.label }}
            </span>
          </a>
        </li>

        <!-- Parent with children -->
        <li
          v-else
          class="relative group/menu"
          @mouseenter="onParentHover(item, idx, $event)"
          @mouseleave="closePopover"
        >
          <button
            :class="[
              'flex items-center gap-3 rounded-lg px-3 py-2 w-full transition-colors cursor-pointer',
              isActive(item.to)
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
              expanded ? '' : 'justify-center',
            ]"
            @click="expanded ? toggleSub(idx) : undefined"
          >
            <component :is="item.icon" class="size-5 shrink-0" />
            <span v-if="expanded" class="flex-1 text-left text-sm font-medium truncate">{{
              item.label
            }}</span>
            <ChevronDown
              v-if="expanded"
              :class="[
                'size-4 shrink-0 transition duration-200',
                openSub === idx ? 'rotate-180' : '',
              ]"
            />
          </button>

          <!-- Acordeón -->
          <Transition @enter="onEnter" @leave="onLeave">
            <div
              v-if="expanded && openSub === idx"
              class="ml-4 mt-0.5 space-y-0.5 border-s border-white/20 pl-2 overflow-hidden"
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
          </Transition>
        </li>
      </template>
    </ul>

    <!-- Popover compacto submenús -->
    <Teleport to="body">
      <div
        v-if="!expanded && popoverItem"
        :style="{ position: 'fixed', top: popoverPos.top + 'px', left: popoverPos.left + 'px' }"
        class="bg-base-100 border border-base-200 rounded-lg shadow-lg z-50 py-1 min-w-44 animate-in fade-in slide-in-from-left-2 duration-200"
        @mouseenter="cancelClose"
        @mouseleave="closePopover"
      >
        <a
          v-for="child in popoverItem.children"
          :key="child.to"
          :href="child.to"
          class="block rounded-lg px-4 py-2 text-sm text-base-contrast hover:bg-base-200 whitespace-nowrap transition-colors"
          @click.prevent="navigate(child.to)"
        >
          {{ child.label }}
        </a>
      </div>
    </Teleport>

    <!-- Popover usuario -->
    <Teleport to="body">
      <div v-if="showUserPop" class="fixed inset-0 z-40" @click="showUserPop = false" />
      <div
        v-if="showUserPop"
        :style="{ position: 'fixed', top: userPopPos.top + 'px', left: userPopPos.left + 'px' }"
        class="bg-base-100 border border-base-200 rounded-lg shadow-lg z-50 py-1 w-44 animate-in fade-in slide-in-from-left-2 duration-200"
      >
        <p class="px-3 py-2 text-sm font-medium text-base-contrast border-b border-base-200">
          {{ auth.usuario?.nombre_usuario || 'Usuario' }}
        </p>
        <button
          v-for="t in temas"
          :key="t.value"
          class="w-full text-left px-3 py-1.5 text-sm text-base-contrast hover:bg-base-200 flex items-center gap-2 transition-colors"
          @click="(setTheme(t.value), (showUserPop = false))"
        >
          <component :is="t.icon" class="size-4" />
          {{ t.label }}
          <Check v-if="theme === t.value" class="size-3.5 ml-auto text-primary" />
        </button>
        <div class="border-t border-base-200 mt-1 pt-1">
          <button
            class="w-full text-left px-3 py-1.5 text-sm text-error hover:bg-error/10 flex items-center gap-2 transition-colors"
            @click="handleLogout"
          >
            <LogOut class="size-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Footer: theme + user + logout -->
    <div
      class="border-t border-white/10 shrink-0 p-2"
      :class="expanded ? '' : 'flex flex-col items-center gap-2'"
    >
      <!-- Theme: segmented cuando expandido, ciclo cuando colapsado -->
      <template v-if="expanded">
        <div class="flex items-center gap-1 p-1 rounded-lg bg-white/10 border border-white/10 mb-2">
          <button
            v-for="opt in temas"
            :key="opt.value"
            @click="setTheme(opt.value)"
            :title="opt.label"
            :class="[
              'flex-1 flex items-center justify-center py-1.5 rounded-md transition-colors',
              theme === opt.value ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white',
            ]"
          >
            <component :is="opt.icon" class="size-3.5" />
          </button>
        </div>
      </template>
      <button
        v-else
        @click="cycleTheme"
        class="grid size-9 place-content-center rounded-lg hover:bg-white/10 transition-colors"
        :title="'Tema: ' + theme"
      >
        <Moon v-if="theme === 'dark'" class="size-4 text-white/70" />
        <Sun v-else-if="theme === 'light'" class="size-4 text-white/70" />
        <Monitor v-else class="size-4 text-white/70" />
      </button>

      <!-- User row -->
      <div class="flex items-center gap-2 w-full" :class="expanded ? '' : 'justify-center'">
        <button
          v-if="!expanded"
          ref="userBtnRef"
          class="grid place-content-center"
          @click="toggleUserPop"
        >
          <BaseAvatar :name="auth.usuario?.nombre_usuario || '?'" size="sm" color="info" />
        </button>
        <template v-else>
          <BaseAvatar
            :name="auth.usuario?.nombre_usuario || '?'"
            size="xs"
            color="info"
            class="shrink-0"
          />
          <span class="text-xs text-white/70 truncate flex-1">{{
            auth.usuario?.nombre_usuario || 'Usuario'
          }}</span>
          <button
            class="grid size-7 place-content-center rounded-md text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            @click="handleLogout"
            aria-label="Cerrar sesión"
          >
            <LogOut class="size-3.5" />
          </button>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  Check,
} from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { useNavigation } from '@/composables/useNavigation'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const navigation = useNavigation()

const expanded = ref(false)
const logoHover = ref(false)
const openSub = ref(null)
const showUserPop = ref(false)
const theme = ref(localStorage.getItem('csd-theme') || 'system')

const popoverItem = ref(null)
const popoverPos = ref({ top: 0, left: 0 })
let closeTimeout = null

const userBtnRef = ref(null)
const userPopPos = ref({ top: 0, left: 0 })

const temas = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

onMounted(() => applyTheme(theme.value))

function toggleSub(idx) {
  openSub.value = openSub.value === idx ? null : idx
}

function onEnter(el) {
  const h = el.scrollHeight
  el.style.maxHeight = '0'
  el.style.opacity = '0'
  el.style.transition = 'max-height 0.2s ease-out, opacity 0.2s ease-out'
  document.body.offsetHeight
  el.style.maxHeight = h + 'px'
  el.style.opacity = '1'
  el.addEventListener(
    'transitionend',
    () => {
      el.style.maxHeight = ''
      el.style.opacity = ''
      el.style.transition = ''
    },
    { once: true },
  )
}

function onLeave(el) {
  const h = el.scrollHeight
  el.style.maxHeight = h + 'px'
  el.style.opacity = '1'
  el.style.transition = 'max-height 0.15s ease-in, opacity 0.15s ease-in'
  document.body.offsetHeight
  el.style.maxHeight = '0'
  el.style.opacity = '0'
}

function isActive(to) {
  if (route.path === to) return true
  if (!route.path.startsWith(to + '/')) return false
  const longer = navigation.items.value.some((item) => {
    const self =
      item.to && item.to !== to && (route.path === item.to || route.path.startsWith(item.to + '/'))
    const child = item.children?.some(
      (c) => c.to !== to && (route.path === c.to || route.path.startsWith(c.to + '/')),
    )
    return self || child
  })
  return !longer
}

function navigate(to) {
  router.push(to)
  openSub.value = null
  showUserPop.value = false
  closePopover()
}

function onParentHover(item, idx, e) {
  if (expanded.value || !item.children) return
  cancelClose()
  const rect = e.currentTarget.getBoundingClientRect()
  popoverPos.value = { top: rect.top, left: rect.right + 8 }
  popoverItem.value = item
}

function closePopover() {
  closeTimeout = setTimeout(() => {
    popoverItem.value = null
  }, 120)
}

function cancelClose() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

function toggleUserPop() {
  showUserPop.value = !showUserPop.value
  if (showUserPop.value && userBtnRef.value) {
    const rect = userBtnRef.value.getBoundingClientRect()
    const popH = 180
    const spaceBelow = window.innerHeight - rect.bottom
    userPopPos.value = {
      top: spaceBelow > popH ? rect.bottom + 4 : rect.top - popH - 4,
      left: rect.left,
    }
  }
}

function cycleTheme() {
  const order = ['light', 'dark', 'system']
  const idx = order.indexOf(theme.value)
  setTheme(order[(idx + 1) % order.length])
}

function setTheme(mode) {
  theme.value = mode
  localStorage.setItem('csd-theme', mode)
  applyTheme(mode)
}

function applyTheme(mode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (isDark) root.classList.add('dark')
  if (mode === 'light') root.classList.add('light')
}

function handleLogout() {
  auth.logout()
  router.push('/auth/login')
}
</script>
