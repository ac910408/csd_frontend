<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="inputClasses"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="$emit('blur', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

defineEmits(['update:modelValue', 'blur'])

const inheritedColor = injectColor('primary')
provideColor(inheritedColor)

const inputClasses = computed(() => {
  const c = inheritedColor.value
  return [
    'w-full px-3 py-2 text-base-content bg-base-100 rounded-lg border transition-colors',
    'placeholder:text-neutral-400',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    props.error
      ? 'border-error focus-visible:ring-error'
      : `border-base-300 focus:border-${c} focus-visible:ring-${c}`,
    props.disabled ? 'opacity-50 cursor-not-allowed bg-base-200' : '',
  ]
})
</script>
