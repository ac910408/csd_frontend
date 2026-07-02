<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="textareaClasses"
    @input="$emit('update:modelValue', ($event.target).value)"
    @blur="$emit('blur')"
  ></textarea>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  id: { type: String, default: () => `textarea-${Math.random().toString(36).slice(2, 8)}` },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  rows: { type: Number, default: 4 },
  error: { type: String, default: '' },
  color: { type: String, default: 'primary' },
})

defineEmits(['update:modelValue', 'blur'])

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))

const textareaClasses = computed(() => [
  'w-full rounded-lg border bg-base-100 px-3 py-2 text-sm text-base-contrast transition-colors resize-none',
  'placeholder:text-neutral',
  'focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  props.error
    ? 'border-error focus:ring-error/30'
    : `border-base-300 focus:border-${c.value} focus:ring-${c.value}/20`,
])
</script>
