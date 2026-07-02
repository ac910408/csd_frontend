<template>
  <div class="min-h-screen bg-base-100 text-base-content flex">
    <AppSidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader />

      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <slot />
      </main>

      <!-- Toasts -->
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AlertMessage
          v-for="t in ui.toasts.value"
          :key="t.id"
          :type="t.type"
          :mensaje="t.mensaje"
          cerrable
          @cerrar="ui.removeToast(t.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.store'

const ui = useUiStore()
</script>
