<template>
  <div class="text-center py-12 flex flex-col items-center gap-3">
    <component :is="iconComponent" class="size-12 text-neutral/30" />
    <p class="text-lg font-medium text-base-contrast">{{ titulo }}</p>
    <p v-if="descripcion" class="text-sm text-neutral max-w-sm">
      {{ descripcion }}
    </p>
    <button
      v-if="accion"
      class="mt-2 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-colors"
      @click="accion.onClick"
    >
      {{ accion.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileSearch, PackageOpen, CalendarOff, ShieldAlert } from '@lucide/vue'

const props = defineProps({
  titulo: { type: String, default: 'Sin resultados' },
  descripcion: { type: String, default: '' },
  icono: { type: String, default: 'file-search' },
  accion: { type: Object, default: null },
})

const icons = {
  'file-search': FileSearch,
  'package-open': PackageOpen,
  'calendar-off': CalendarOff,
  'shield-alert': ShieldAlert,
}
const iconComponent = computed(() => icons[props.icono] || FileSearch)
</script>
