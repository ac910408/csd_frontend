<template>
  <div class="relative">
    <span
      v-if="$slots.prefix"
      class="absolute inset-y-0 start-0 grid w-9 place-content-center text-neutral"
    >
      <slot name="prefix" />
    </span>
    <input
      :id="id"
      :name="name"
      :autocomplete="autocomplete"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <span
      v-if="$slots.suffix"
      class="absolute inset-y-0 end-0 grid w-9 place-content-center text-neutral"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 8)}` },
  name: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  color: { type: String, default: 'primary' },
  autocomplete: { type: String, default: '' },
})

defineEmits(['update:modelValue', 'blur'])

const slots = useSlots()

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))

const inputClasses = computed(() => [
  'w-full rounded-lg border bg-base-100 px-3 py-2 text-sm text-base-contrast transition-colors',
  'placeholder:text-neutral',
  'focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  props.error
    ? 'border-error focus:ring-error/30'
    : `border-base-300 focus:border-${c.value} focus:ring-${c.value}/20`,
  { 'ps-9': slots.prefix },
  { 'pe-9': slots.suffix },
])
</script>
