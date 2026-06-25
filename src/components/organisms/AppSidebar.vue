<template>
  <aside :class="sidebarClasses" role="navigation" aria-label="Navegación principal">
    <!-- Overlay mobile -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="$emit('update:mobileOpen', false)"
    />

    <nav :class="navClasses">
      <!-- Logo en sidebar (desktop) -->
      <div class="hidden lg:flex items-center gap-2 h-16 px-4 border-b border-base-200">
        <img v-if="logo" :src="logo" alt="CSD" class="h-7 w-auto" />
        <span class="font-bold text-base-content">CSD</span>
      </div>

      <!-- Items de navegación -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <template v-for="item in navigation.items.value" :key="item.to">
          <!-- Item sin hijos -->
          <a
            v-if="!item.children"
            :href="item.to"
            :class="navItemClasses(item)"
            @click.prevent="navigate(item.to)"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span class="truncate">{{ item.label }}</span>
          </a>

          <!-- Item con hijos -->
          <div v-else>
            <button :class="navItemClasses(item)" class="w-full" @click="toggleExpand(item.to)">
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              <span class="flex-1 text-left truncate">{{ item.label }}</span>
              <ChevronDown
                :class="['w-4 h-4 transition-transform', expanded === item.to ? 'rotate-180' : '']"
              />
            </button>

            <div v-if="expanded === item.to" class="ml-4 mt-1 space-y-1">
              <a
                v-for="child in item.children"
                :key="child.to"
                :href="child.to"
                :class="navChildClasses(child)"
                @click.prevent="navigate(child.to)"
              >
                {{ child.label }}
              </a>
            </div>
          </div>
        </template>
      </div>

      <!-- Footer sidebar -->
      <div class="px-4 py-3 border-t border-base-200">
        <p class="text-xs text-neutral truncate">
          {{ auth.usuario?.nombre_usuario }}
        </p>
        <p class="text-xs text-neutral/60">{{ auth.rolActivo }}</p>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { useNavigation } from '@/composables/useNavigation'

const props = defineProps({
  mobileOpen: { type: Boolean, default: false },
  logo: { type: String, default: '' },
})

defineEmits(['update:mobileOpen'])

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const navigation = useNavigation()
const expanded = ref(null)

const sidebarClasses = computed(() => ['flex-shrink-0'])

const navClasses = computed(() => [
  'fixed top-0 left-0 z-50 h-full w-64 bg-base-100 border-r border-base-200',
  'flex flex-col',
  'transition-transform duration-300',
  // En desktop siempre visible como sidebar
  'lg:translate-x-0 lg:static lg:z-auto',
  // En mobile: animado
  props.mobileOpen ? 'translate-x-0' : '-translate-x-full',
])

function isActive(to) {
  return route.path === to || route.path.startsWith(to + '/')
}

function navItemClasses(item) {
  return [
    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
    isActive(item.to)
      ? 'bg-primary/10 text-primary font-medium'
      : 'text-base-content hover:bg-base-200',
  ]
}

function navChildClasses(child) {
  return [
    'block px-3 py-1.5 rounded-lg text-sm transition-colors',
    isActive(child.to)
      ? 'text-primary font-medium'
      : 'text-neutral hover:text-base-content hover:bg-base-200',
  ]
}

function toggleExpand(key) {
  expanded.value = expanded.value === key ? null : key
}

function navigate(to) {
  router.push(to)
  // Cerrar sidebar en mobile
  if (props.mobileOpen) {
    // emit update:mobileOpen false
  }
}
</script>
