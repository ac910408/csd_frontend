<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="$emit('update:modelValue', ($event.target).value)"
      @blur="$emit('blur')"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <slot />
    </select>
    <span
      class="absolute inset-y-0 end-0 grid w-9 place-content-center text-neutral pointer-events-none"
    >
      <ChevronDown class="size-4" />
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  id: { type: String, default: () => `select-${Math.random().toString(36).slice(2, 8)}` },
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  color: { type: String, default: 'primary' },
})

defineEmits(['update:modelValue', 'blur'])

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))

const selectClasses = computed(() => [
  'w-full rounded-lg border bg-base-100 px-3 py-2 text-sm text-base-contrast transition-colors appearance-none',
  'focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  props.error
    ? 'border-error focus:ring-error/30'
    : `border-base-300 focus:border-${c.value} focus:ring-${c.value}/20`,
])
</script>
