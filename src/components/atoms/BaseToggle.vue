<template>
  <label
    :for="id"
    class="relative block h-7 w-12 rounded-full transition-colors cursor-pointer"
    :class="modelValue ? `bg-${c}` : 'bg-base-300'"
  >
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="peer sr-only"
      @change="$emit('update:modelValue', ($event.target).checked)"
    />
    <span
      class="absolute inset-y-0 start-0 m-0.5 size-6 rounded-full bg-base-100 shadow-sm transition-all peer-checked:start-5"
    />
  </label>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  id: { type: String, default: () => `tg-${Math.random().toString(36).slice(2, 8)}` },
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  color: { type: String, default: 'success' },
})

defineEmits(['update:modelValue'])

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))
</script>
