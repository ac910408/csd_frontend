<template>
  <div class="min-h-screen bg-base-100 flex">
    <AppSidebar :mobile-open="sidebarOpen" @update:mobile-open="sidebarOpen = $event" />

    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- Overlay mobile sidebar -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="sidebarOpen = false"
      />

      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <slot />
      </main>

      <!-- Toasts -->
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <div
          v-for="t in ui.toasts.value"
          :key="t.id"
          :class="toastClasses(t.type)"
          class="px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-slide-up"
          role="alert"
        >
          <CircleCheck v-if="t.type === 'success'" class="w-4 h-4 flex-shrink-0" />
          <TriangleAlert v-else-if="t.type === 'warning'" class="w-4 h-4 flex-shrink-0" />
          <CircleAlert v-else-if="t.type === 'error'" class="w-4 h-4 flex-shrink-0" />
          <Info v-else class="w-4 h-4 flex-shrink-0" />
          <span>{{ t.mensaje }}</span>
          <button
            class="ml-auto p-0.5 rounded hover:bg-black/10"
            @click="ui.removeToast(t.id)"
            aria-label="Cerrar"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CircleCheck, TriangleAlert, CircleAlert, Info, X } from '@lucide/vue'
import { useUiStore } from '@/stores/ui.store'

const sidebarOpen = ref(false)
const ui = useUiStore()

function toastClasses(type) {
  const map = {
    success: 'bg-success text-success-contrast',
    error: 'bg-error text-error-contrast',
    warning: 'bg-warning text-warning-contrast',
    info: 'bg-info text-info-contrast',
  }
  return map[type] || map.info
}
</script>
