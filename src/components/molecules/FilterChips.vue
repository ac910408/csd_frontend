<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="op in opciones"
      :key="op.value"
      :class="chipClasses(op)"
      @click="toggle(op.value)"
    >
      {{ op.label }}
      <X v-if="isSelected(op.value)" class="w-3 h-3 ml-1" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  opciones: {
    type: Array,
    default: () => [],
    // cada item: { value, label }
  },
  seleccionados: { type: Array, default: () => [] },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const emit = defineEmits(['update:seleccionados'])

const inheritedColor = injectColor(props.color)

function isSelected(val) {
  return props.seleccionados.includes(val)
}

function toggle(val) {
  const next = isSelected(val)
    ? props.seleccionados.filter((v) => v !== val)
    : [...props.seleccionados, val]
  emit('update:seleccionados', next)
}

function chipClasses(op) {
  const selected = isSelected(op.value)
  const c = inheritedColor.value
  return [
    'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
    selected
      ? `bg-${c} text-${c}-contrast border-${c}`
      : `bg-base-100 text-base-content border-base-300 hover:border-${c} hover:text-${c}`,
  ]
}
</script>
