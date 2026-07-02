<template>
  <div class="flex gap-1 flex-wrap">
    <button
      v-for="o in opciones"
      :key="o.value"
      :class="[
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        seleccionados.includes(o.value)
          ? `bg-${color}/10 text-${color} border border-${color}/20`
          : 'bg-base-200 text-neutral hover:bg-base-300',
      ]"
      @click="toggle(o.value)"
    >
      {{ o.label }}
      <X v-if="seleccionados.includes(o.value)" class="size-3" />
    </button>
  </div>
</template>

<script setup>
import { X } from '@lucide/vue'

const props = defineProps({
  opciones: { type: Array, default: () => [] },
  seleccionados: { type: Array, default: () => [] },
  color: { type: String, default: 'primary' },
})

const emit = defineEmits(['update:seleccionados'])

function toggle(value) {
  const s = [...props.seleccionados]
  const idx = s.indexOf(value)
  if (idx >= 0) s.splice(idx, 1)
  else s.push(value)
  emit('update:seleccionados', s)
}
</script>
