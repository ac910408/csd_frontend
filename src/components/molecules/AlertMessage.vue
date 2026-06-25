<template>
  <div :class="wrapperClasses" role="alert">
    <div class="flex items-start gap-3">
      <component :is="iconMap[type]" class="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium">{{ mensaje }}</p>
      </div>
      <button
        v-if="cerrable"
        class="p-0.5 rounded hover:bg-black/10 transition-colors flex-shrink-0"
        @click="$emit('cerrar')"
        aria-label="Cerrar"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Info, CircleCheck, TriangleAlert, CircleAlert } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'warning', 'error'].includes(v),
  },
  mensaje: { type: String, required: true },
  cerrable: { type: Boolean, default: false },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

defineEmits(['cerrar'])

// eslint-disable-next-line no-unused-vars
const inheritedColor = injectColor(props.color)

const iconMap = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
}

const colorMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
}

const wrapperClasses = computed(() => {
  const c = colorMap[props.type]
  return [
    'flex items-start gap-3 px-4 py-3 rounded-lg border text-sm',
    `bg-${c}-50 border-${c}-200 text-${c}-800`,
  ]
})
</script>
