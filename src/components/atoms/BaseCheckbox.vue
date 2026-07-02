<template>
  <label :for="id" class="inline-flex items-start gap-3 cursor-pointer">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="mt-0.5 size-5 rounded border-base-300 bg-base-100 transition-colors focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="checkboxColor"
      @change="$emit('update:modelValue', ($event.target).checked)"
    />
    <span v-if="label" class="text-sm text-base-contrast">{{ label }}</span>
    <span v-else class="text-sm text-base-contrast"><slot /></span>
  </label>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  id: { type: String, default: () => `cb-${Math.random().toString(36).slice(2, 8)}` },
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
})

defineEmits(['update:modelValue'])

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))

const checkboxColor = computed(() => `text-${c.value} focus:ring-${c.value}/20`)
</script>
