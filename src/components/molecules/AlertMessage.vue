<template>
  <div v-if="visible" :class="alertClasses" role="alert">
    <component :is="iconMap[type]" class="size-4 flex-shrink-0" />
    <span class="flex-1">{{ mensaje }}</span>
    <button
      v-if="cerrable"
      class="ml-2 p-0.5 rounded hover:bg-base-200 transition-colors"
      @click="$emit('cerrar')"
      aria-label="Cerrar"
    >
      <X class="size-3" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Info, CircleCheck, TriangleAlert, CircleAlert, X } from '@lucide/vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'warning', 'error'].includes(v),
  },
  mensaje: { type: String, required: true },
  cerrable: { type: Boolean, default: false },
})

defineEmits(['cerrar'])

const visible = computed(() => !!props.mensaje)

const iconMap = { info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleAlert }

const colorMap = {
  info: 'bg-info/10 text-info border-info/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
}

const alertClasses = computed(() => [
  'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm',
  colorMap[props.type],
])
</script>
